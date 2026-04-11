require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const {
  SESSION_DURATION_MS,
  createAuthToken,
  generateUuidV4,
  hashPassword,
  verifyPassword,
} = require('../config/salt');

const GO_SYNC_URL = process.env.GO_API_URL || 'http://localhost:6870';
const LOCAL_DATABASE_NAME = process.env.DB_NAME || 'quickquest_local';
const REGISTER_SYNC_TO_GO = toBooleanFlag(process.env.REGISTER_SYNC_TO_GO, true);
const AUTH_SESSION_COOKIE_NAME = trimValue(process.env.AUTH_SESSION_COOKIE_NAME) || 'qqm_session';
const AUTH_COOKIE_SAME_SITE = normalizeSameSite(process.env.AUTH_COOKIE_SAME_SITE);
const AUTH_COOKIE_SECURE = toBooleanFlag(process.env.AUTH_COOKIE_SECURE, false);

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: LOCAL_DATABASE_NAME,
  }),
});

function trimValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toBooleanFlag(value, defaultValue) {
  const normalized = trimValue(value).toLowerCase();
  if (!normalized) {
    return defaultValue;
  }

  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) {
    return true;
  }

  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function normalizeSameSite(value) {
  const normalized = trimValue(value).toLowerCase();
  if (normalized === 'strict' || normalized === 'none') {
    return normalized;
  }

  return 'lax';
}

function getSessionCookieConfig() {
  const secure = AUTH_COOKIE_SECURE || AUTH_COOKIE_SAME_SITE === 'none';
  return {
    httpOnly: true,
    sameSite: AUTH_COOKIE_SAME_SITE,
    secure,
    maxAge: SESSION_DURATION_MS,
    path: '/',
  };
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

function buildValidationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizePhone(value) {
  const phone = trimValue(value);
  if (!/^\+?[0-9]{8,16}$/.test(phone)) {
    throw buildValidationError('Nomor HP harus angka 8-16 digit.');
  }

  return phone.startsWith('+') ? phone.slice(1) : phone;
}

function collectRegisterRequest(body) {
  const {
    username,
    email,
    phone,
    fullname,
    birthdate,
    province,
    city,
    district,
    sub_district,
    full_address,
    tags_skills,
    password,
  } = body ?? {};

  const payload = {
    username: trimValue(username),
    email: trimValue(email).toLowerCase(),
    phone: normalizePhone(phone),
    fullname: trimValue(fullname),
    birthdate: trimValue(birthdate),
    province: trimValue(province),
    city: trimValue(city),
    district: trimValue(district),
    sub_district: trimValue(sub_district),
    full_address: trimValue(full_address),
    tags_skills: normalizeSkills(tags_skills),
    password: trimValue(password),
  };

  const requiredFields = [
    ['username', payload.username],
    ['email', payload.email],
    ['phone', payload.phone],
    ['fullname', payload.fullname],
    ['birthdate', payload.birthdate],
    ['province', payload.province],
    ['city', payload.city],
    ['district', payload.district],
    ['sub_district', payload.sub_district],
    ['full_address', payload.full_address],
    ['password', payload.password],
  ];

  const missingField = requiredFields.find(([, value]) => !value);
  if (missingField) {
    throw buildValidationError(`Field ${missingField[0]} wajib diisi.`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw buildValidationError('Format email belum valid.');
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

function collectLoginRequest(body) {
  const { identity, password } = body ?? {};
  const normalizedIdentity = trimValue(identity).toLowerCase();
  const normalizedPassword = trimValue(password);
  const normalizedPhoneIdentity = /^\+?[0-9]{8,16}$/.test(normalizedIdentity)
    ? normalizedIdentity.replace(/^\+/, '')
    : null;

  if (!normalizedIdentity || !normalizedPassword) {
    throw buildValidationError('Identity dan password wajib diisi.');
  }

  return {
    identity: normalizedIdentity,
    password: normalizedPassword,
    phoneIdentity: normalizedPhoneIdentity,
  };
}

async function rollbackLocalRegister(entityId, username, email, phone) {
  if (!entityId || !username || !email || !phone) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.auth.delete({
      where: {
        id_username_email_phone: {
          id: entityId,
          username,
          email,
          phone,
        },
      },
    });
    await tx.user.delete({
      where: {
        id_email_username_phone: {
          id: entityId,
          email,
          username,
          phone,
        },
      },
    });
  });
}

async function syncRegisterToGo(syncPayload) {
  const response = await fetch(`${GO_SYNC_URL}/endpoint/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(syncPayload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw buildValidationError(data?.message || 'Sinkronisasi ke Gateway Go gagal.', 502);
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

  router.get('/health/auth', (req, res) => {
    res.json({
      success: true,
      message: 'Auth endpoint aktif.',
      data: {
        database: LOCAL_DATABASE_NAME,
        goSyncUrl: GO_SYNC_URL,
        registerSyncToGo: REGISTER_SYNC_TO_GO,
        sessionCookieName: AUTH_SESSION_COOKIE_NAME,
        sessionCookieSameSite: AUTH_COOKIE_SAME_SITE,
      },
    });
  });

  router.post('/register', async (req, res) => {
    let createdRecords = null;

    try {
      const registerPayload = collectRegisterRequest(req.body);

      const duplicateIdentity = await prisma.auth.findFirst({
        where: {
          OR: [
            { username: registerPayload.username },
            { email: registerPayload.email },
            { phone: registerPayload.phone },
          ],
        },
      });

      if (duplicateIdentity) {
        throw buildValidationError('Username, email, atau nomor HP sudah terdaftar.', 409);
      }

      const entityId = generateUuidV4();
      const passwordHash = hashPassword(registerPayload.password);
      const authToken = createAuthToken({
        id: entityId,
        username: registerPayload.username,
        email: registerPayload.email,
        phone: registerPayload.phone,
      });
      const currentDate = new Date();

      createdRecords = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            id: entityId,
            username: registerPayload.username,
            email: registerPayload.email,
            phone: registerPayload.phone,
            fullname: registerPayload.fullname,
            birthdate: registerPayload.parsedBirthdate,
            province: registerPayload.province,
            city: registerPayload.city,
            district: registerPayload.district,
            sub_district: registerPayload.sub_district,
            full_address: registerPayload.full_address,
            tags_skill: registerPayload.tags_skills || null,
            created_at: currentDate,
            updated_at: currentDate,
          },
        });

        const auth = await tx.auth.create({
          data: {
            id: entityId,
            username: registerPayload.username,
            email: registerPayload.email,
            phone: registerPayload.phone,
            password: passwordHash,
            auth_token: authToken,
            created_at: currentDate,
            updated_at: currentDate,
          },
        });

        return { user, auth };
      });

      let syncResult = null;
      let responseMessage = 'Register lokal berhasil disimpan tanpa sync ke Go.';

      if (REGISTER_SYNC_TO_GO) {
        syncResult = await syncRegisterToGo({
          id: createdRecords.user.id,
          username: createdRecords.user.username,
          email: createdRecords.user.email,
          phone: createdRecords.user.phone.toString(),
          fullname: createdRecords.user.fullname,
          birthdate: createdRecords.user.birthdate,
          province: createdRecords.user.province,
          city: createdRecords.user.city,
          district: createdRecords.user.district,
          sub_district: createdRecords.user.sub_district,
          full_address: createdRecords.user.full_address,
          tags_skills: createdRecords.user.tags_skill || '',
          password: passwordHash,
          authorization: createdRecords.user.authorization,
          auth_token: authToken,
        });

        responseMessage = 'Register lokal berhasil disimpan dan sync ke Go berhasil.';
      }

      return res.status(201).json({
        success: true,
        message: responseMessage,
        data: {
          user: {
            id: createdRecords.user.id,
            username: createdRecords.user.username,
            email: createdRecords.user.email,
            phone: createdRecords.user.phone.toString(),
          },
          auth: {
            id: createdRecords.auth.id,
            auth_token: createdRecords.auth.auth_token,
          },
          sync: REGISTER_SYNC_TO_GO ? (syncResult?.data ?? syncResult ?? null) : null,
          sync_enabled: REGISTER_SYNC_TO_GO,
        },
      });
    } catch (error) {
      if (createdRecords?.user?.id) {
        try {
          await rollbackLocalRegister(
            createdRecords.user.id,
            createdRecords.user.username,
            createdRecords.user.email,
            createdRecords.user.phone,
          );
        } catch (rollbackError) {
          return res.status(502).json({
            success: false,
            message: error?.message || 'Register gagal setelah sync ke Go.',
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

  router.post('/login', async (req, res) => {
    try {
      const loginPayload = collectLoginRequest(req.body);
      const identityFilters = [
        { username: loginPayload.identity },
        { email: loginPayload.identity },
      ];

      if (loginPayload.phoneIdentity) {
        identityFilters.push({ phone: loginPayload.phoneIdentity });
      }

      const authRecord = await prisma.auth.findFirst({
        where: {
          OR: identityFilters,
        },
      });

      if (!authRecord || !verifyPassword(loginPayload.password, authRecord.password)) {
        throw buildValidationError('Identity atau password salah.', 401);
      }

      const issuedAt = Date.now();
      const expiresAt = issuedAt + SESSION_DURATION_MS;
      const renewedAuthToken = createAuthToken({
        id: authRecord.id,
        username: authRecord.username,
        email: authRecord.email,
        phone: authRecord.phone.toString(),
      });

      await prisma.auth.update({
        where: {
          id_username_email_phone: {
            id: authRecord.id,
            username: authRecord.username,
            email: authRecord.email,
            phone: authRecord.phone,
          },
        },
        data: {
          auth_token: renewedAuthToken,
          updated_at: new Date(),
        },
      });

      res.cookie(AUTH_SESSION_COOKIE_NAME, renewedAuthToken, getSessionCookieConfig());

      return res.json({
        success: true,
        message: 'Login berhasil.',
        data: {
          session: {
            accessToken: renewedAuthToken,
            issuedAt,
            expiresAt,
            user: {
              id: authRecord.id,
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

  return router;
};

module.exports = AuthenticationService;
