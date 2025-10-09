const express = require('express');
const router = express.Router();

/**
 * Admin Routes Integration
 * 관리자 API 라우트 통합
 *
 * Base Path: /api/admin
 */

// Admin 하위 라우트 import
const orderRoutes = require('./admin/adminOrder.routes');
const productRoutes = require('./admin/adminProduct.routes');
const dashboardRoutes = require('./admin/adminDashboard.routes');

/**
 * Admin 라우트 연결
 */
router.use('/orders', orderRoutes);           // /api/admin/orders
router.use('/products', productRoutes);       // /api/admin/products
router.use('/dashboard', dashboardRoutes);    // /api/admin/dashboard

module.exports = router;
