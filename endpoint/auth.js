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

const LOCAL_DATABASE_NAME = process.env.DB_NAME || 'quickquest_local';

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
    phone: trimValue(phone),
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

function collectLoginRequest(body) {
  const { identity, password } = body ?? {};
  const normalizedIdentity = trimValue(identity).toLowerCase();
  const normalizedPassword = trimValue(password);

  if (!normalizedIdentity || !normalizedPassword) {
    throw buildValidationError('Identity dan password wajib diisi.');
  }

  return {
    identity: normalizedIdentity,
    password: normalizedPassword,
  };
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
      },
    });
  });

  router.post('/register', async (req, res) => {
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

      const createdRecords = await prisma.$transaction(async (tx) => {
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
            tags_skills: registerPayload.tags_skills,
          },
        });

        const auth = await tx.auth.create({
          data: {
            id: entityId,
            user_id: entityId,
            username: registerPayload.username,
            email: registerPayload.email,
            phone: registerPayload.phone,
            password: passwordHash,
            auth_token: authToken,
          },
        });

        return { user, auth };
      });

      return res.status(201).json({
        success: true,
        message: 'Register lokal berhasil disimpan.',
        data: {
          user: {
            id: createdRecords.user.id,
            username: createdRecords.user.username,
            email: createdRecords.user.email,
            phone: createdRecords.user.phone,
          },
          auth: {
            id: createdRecords.auth.id,
            auth_token: createdRecords.auth.auth_token,
          },
        },
      });
    } catch (error) {
      return sendError(res, error, 'Register gagal diproses.');
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const loginPayload = collectLoginRequest(req.body);

      const authRecord = await prisma.auth.findFirst({
        where: {
          OR: [
            { username: loginPayload.identity },
            { email: loginPayload.identity },
            { phone: loginPayload.identity },
          ],
        },
        include: {
          user: true,
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
        phone: authRecord.phone,
      });

      await prisma.auth.update({
        where: { id: authRecord.id },
        data: {
          auth_token: renewedAuthToken,
        },
      });

      return res.json({
        success: true,
        message: 'Login berhasil.',
        data: {
          session: {
            accessToken: renewedAuthToken,
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

  return router;
};

module.exports = AuthenticationService;
