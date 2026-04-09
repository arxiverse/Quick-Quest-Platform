const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const {
  SESSION_DURATION_MS,
  createAccessToken,
  getGoGatewayUrl,
  hashPassword,
  verifyPassword,
} = require('./config');

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quickquest',
  }),
});

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSkills(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => trimValue(item))
      .filter(Boolean)
      .join(', ');
  }

  return trimValue(value);
}

function buildValidationError(message, status = 400) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function normalizeRegisterPayload(body) {
  const payload = {
    email: trimValue(body.email).toLowerCase(),
    username: trimValue(body.username),
    phone: trimValue(body.phone),
    fullname: trimValue(body.fullname),
    birthdate: trimValue(body.birthdate),
    province: trimValue(body.province),
    city: trimValue(body.city),
    district: trimValue(body.district),
    sub_district: trimValue(body.sub_district),
    full_address: trimValue(body.full_address),
    tags_skills: normalizeSkills(body.tags_skills),
    password: trimValue(body.password),
    authorization: 'user',
  };

  const requiredFields = [
    ['email', payload.email],
    ['username', payload.username],
    ['phone', payload.phone],
    ['fullname', payload.fullname],
    ['birthdate', payload.birthdate],
    ['province', payload.province],
    ['city', payload.city],
    ['district', payload.district],
    ['sub_district', payload.sub_district],
    ['full_address', payload.full_address],
    ['tags_skills', payload.tags_skills],
    ['password', payload.password],
  ];

  const missingField = requiredFields.find(([, value]) => !value);
  if (missingField) {
    throw buildValidationError(`Field ${missingField[0]} wajib diisi.`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw buildValidationError('Format email belum valid.');
  }

  if (!/^\+?[0-9]{8,16}$/.test(payload.phone)) {
    throw buildValidationError('Nomor HP harus angka 8-16 digit.');
  }

  if (payload.password.length < 8) {
    throw buildValidationError('Password minimal 8 karakter.');
  }

  const parsedBirthdate = new Date(payload.birthdate);
  if (Number.isNaN(parsedBirthdate.getTime())) {
    throw buildValidationError('Tanggal lahir belum valid.');
  }

  return {
    ...payload,
    parsedBirthdate,
  };
}

function normalizeLoginPayload(body) {
  const identity = trimValue(body.identity).toLowerCase();
  const password = trimValue(body.password);

  if (!identity || !password) {
    throw buildValidationError('Identity dan password wajib diisi.');
  }

  return { identity, password };
}

async function rollbackLocalRegister(localState) {
  if (!localState?.user?.id || !localState?.auth?.id) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.auth.delete({ where: { id: localState.auth.id } });
    await tx.user.delete({ where: { id: localState.user.id } });
  });
}

async function forwardRegisterToGo(localState) {
  const response = await fetch(`${getGoGatewayUrl()}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        id: localState.user.id,
        email: localState.user.email,
        username: localState.user.username,
        phone: localState.user.phone,
        fullname: localState.user.fullname,
        birthdate: localState.user.birthdate,
        province: localState.user.province,
        city: localState.user.city,
        district: localState.user.district,
        sub_district: localState.user.sub_district,
        full_address: localState.user.full_address,
        tags_skills: localState.user.tags_skills,
        authorization: localState.user.authorization,
        created_at: localState.user.created_at,
        updated_at: localState.user.updated_at,
      },
      auth: {
        id: localState.auth.id,
        user_id: localState.auth.user_id,
        email: localState.auth.email,
        username: localState.auth.username,
        phone: localState.auth.phone,
        authorization: localState.auth.authorization,
        password: localState.auth.password,
        auth_token: localState.auth.auth_token,
        created_at: localState.auth.created_at,
        updated_at: localState.auth.updated_at,
      },
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw buildValidationError(data?.message || data?.error || 'Sinkronisasi cloud ke Golang gagal.', 502);
  }

  return data;
}

function sendError(res, error, fallbackMessage) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error?.message || fallbackMessage,
  });
}

const AuthenticationService = () => {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    try {
      const { identity, password } = normalizeLoginPayload(req.body ?? {});

      const authRecord = await prisma.auth.findFirst({
        where: {
          OR: [
            { email: identity },
            { username: identity },
            { phone: identity },
          ],
        },
        include: {
          user: true,
        },
      });

      if (!authRecord || !verifyPassword(password, authRecord.password)) {
        throw buildValidationError('Identity atau password salah.', 401);
      }

      const issuedAt = Date.now();
      const expiresAt = issuedAt + SESSION_DURATION_MS;
      const accessToken = createAccessToken();

      await prisma.auth.update({
        where: { id: authRecord.id },
        data: {
          auth_token: accessToken,
        },
      });

      return res.json({
        success: true,
        message: 'Login berhasil.',
        data: {
          session: {
            accessToken,
            issuedAt,
            expiresAt,
            user: {
              id: authRecord.user.id,
              username: authRecord.username,
              email: authRecord.email,
            },
          },
          authorization: authRecord.authorization,
        },
      });
    } catch (error) {
      return sendError(res, error, 'Login gagal diproses.');
    }
  });

  router.post('/register', async (req, res) => {
    let localState = null;

    try {
      const payload = normalizeRegisterPayload(req.body ?? {});

      const duplicateIdentity = await prisma.auth.findFirst({
        where: {
          OR: [
            { email: payload.email },
            { username: payload.username },
            { phone: payload.phone },
          ],
        },
      });

      if (duplicateIdentity) {
        throw buildValidationError('Email, username, atau nomor HP sudah terdaftar.', 409);
      }

      const passwordHash = hashPassword(payload.password);

      localState = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: payload.email,
            username: payload.username,
            phone: payload.phone,
            fullname: payload.fullname,
            birthdate: payload.parsedBirthdate,
            province: payload.province,
            city: payload.city,
            district: payload.district,
            sub_district: payload.sub_district,
            full_address: payload.full_address,
            tags_skills: payload.tags_skills,
            authorization: payload.authorization,
          },
        });

        const auth = await tx.auth.create({
          data: {
            user_id: user.id,
            email: payload.email,
            username: payload.username,
            phone: payload.phone,
            authorization: payload.authorization,
            password: passwordHash,
          },
        });

        return { user, auth };
      });

      const cloudResult = await forwardRegisterToGo(localState);

      return res.status(201).json({
        success: true,
        message: 'Register berhasil dan data sudah sinkron ke cloud.',
        data: {
          local: {
            user_id: localState.user.id,
            auth_id: localState.auth.id,
          },
          cloud: cloudResult?.data ?? cloudResult ?? null,
        },
      });
    } catch (error) {
      if (localState) {
        try {
          await rollbackLocalRegister(localState);
        } catch (rollbackError) {
          return res.status(502).json({
            success: false,
            message: error?.message || 'Register gagal saat sinkron cloud.',
            rollback: {
              success: false,
              message: rollbackError?.message || 'Rollback lokal gagal.',
            },
          });
        }
      }

      return sendError(res, error, 'Register gagal diproses.');
    }
  });

  return router;
};

module.exports = AuthenticationService;
