const express = require('express');

const ProfileService = () => {
  const router = express.Router();

  router.get('/profile', (req, res) => {
    res.json({
      success: true,
      message: 'Profile gateway aktif.',
      data: null,
    });
  });

  return router;
};

module.exports = ProfileService;
