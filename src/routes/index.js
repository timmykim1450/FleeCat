const express = require('express');
const router = express.Router();

// 라우터 임포트
const authRoutes = require('./auth.routes');
const memberRoutes = require('./member.routes');
const adminRoutes = require('./admin.routes');

// 라우터 연결
router.use('/auth', authRoutes);
router.use('/members', memberRoutes);
router.use('/admin', adminRoutes);

// 기본 라우트 (API 상태 확인용)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fleecat API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      members: '/api/v1/members',
      admin: '/api/v1/admin'
    }
  });
});

module.exports = router;
