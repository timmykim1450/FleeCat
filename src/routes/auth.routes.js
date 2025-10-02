const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin, validateChangePassword } = require('../middlewares/validation');
const { authenticate } = require('../middlewares/auth');

/**
 * Auth Routes
 * 인증 관련 API 엔드포인트
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    회원가입
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    로그인
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    비밀번호 변경
 * @access  Private
 */
router.put('/change-password', authenticate, validateChangePassword, authController.changePassword);

module.exports = router;
