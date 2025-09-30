const express = require('express');
const router = express.Router();

// 라우터들을 여기에 추가
// const authRoutes = require('./auth.routes');
// const productRoutes = require('./product.routes');

// router.use('/auth', authRoutes);
// router.use('/products', productRoutes);

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Fleecat API v1',
    version: '1.0.0'
  });
});

module.exports = router;
