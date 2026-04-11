require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const LOCAL_DATABASE_NAME = process.env.DB_NAME || 'quickquest_local';
const AUTH_SESSION_COOKIE_NAME = trimValue(process.env.AUTH_SESSION_COOKIE_NAME) || 'qqm_session';

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

function buildValidationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function extractBearerToken(authorizationHeader) {
  const normalizedHeader = trimValue(authorizationHeader);
  if (!normalizedHeader) {
    return '';
  }

  const [scheme, token] = normalizedHeader.split(' ');
  if (trimValue(scheme).toLowerCase() !== 'bearer') {
    return '';
  }

  return trimValue(token);
}

function extractCookieToken(cookieHeader, cookieName) {
  const normalizedHeader = trimValue(cookieHeader);
  if (!normalizedHeader) {
    return '';
  }

  const pairs = normalizedHeader.split(';');
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.split('=');
    if (trimValue(rawName) !== cookieName) {
      continue;
    }

    return decodeURIComponent(trimValue(rawValueParts.join('=')));
  }

  return '';
}

function resolveSessionToken(req) {
  const bearerToken = extractBearerToken(req.headers.authorization);
  if (bearerToken) {
    return bearerToken;
  }

  return extractCookieToken(req.headers.cookie, AUTH_SESSION_COOKIE_NAME);
}

function sendError(res, error, fallbackMessage) {
  const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error?.message || fallbackMessage,
  });
}

async function handleGetProfile(req, res) {
  try {
    const sessionToken = resolveSessionToken(req);
    if (!sessionToken) {
      throw buildValidationError('Token sesi tidak ditemukan. Kirim bearer token atau cookie sesi.', 401);
    }

    const authRecord = await prisma.auth.findFirst({
      where: {
        auth_token: sessionToken,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
      },
    });

    if (!authRecord) {
      throw buildValidationError('Token sesi tidak valid atau sudah kadaluarsa.', 401);
    }

    const userRecord = await prisma.user.findUnique({
      where: {
        id_email_username_phone: {
          id: authRecord.id,
          email: authRecord.email,
          username: authRecord.username,
          phone: authRecord.phone,
        },
      },
      select: {
        fullname: true,
        email: true,
        phone: true,
        full_address: true,
      },
    });

    if (!userRecord) {
      throw buildValidationError('Data profile user tidak ditemukan.', 404);
    }

    return res.json({
      success: true,
      message: 'Profile berhasil diambil.',
      data: {
        fullname: userRecord.fullname,
        email: userRecord.email,
        phone: userRecord.phone.toString(),
        full_address: userRecord.full_address,
      },
    });
  } catch (error) {
    return sendError(res, error, 'Gagal mengambil data profile.');
  }
}

const ProfileService = () => {
  const router = express.Router();

  router.get('/profile', handleGetProfile);
  router.get('/lprofile', handleGetProfile);

  return router;
};

module.exports = ProfileService;
