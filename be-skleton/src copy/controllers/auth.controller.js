const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

/**
 * Auth Controller
 * 인증 관련 HTTP 요청/응답 처리
 */

/**
 * 회원가입
 *
 * @description
 * POST /api/v1/auth/register
 * 새로운 회원을 등록합니다.
 *
 * @route POST /api/v1/auth/register
 * @access Public
 *
 * @param {Object} req.body - 회원가입 데이터
 * @param {string} req.body.email - 이메일
 * @param {string} req.body.password - 비밀번호
 * @param {string} req.body.name - 이름
 * @param {string} req.body.nickname - 닉네임
 * @param {string} [req.body.phone] - 전화번호 (선택)
 *
 * @returns {Object} 201 - { success: true, message: '...', data: { member, token } }
 * @returns {Object} 400 - { success: false, message: 'Email already exists' }
 *
 * @example
 * // Request
 * POST /api/v1/auth/register
 * {
 *   "email": "user@example.com",
 *   "password": "secure123!",
 *   "name": "홍길동",
 *   "nickname": "길동이",
 *   "phone": "010-1234-5678"
 * }
 *
 * // Response (201 Created)
 * {
 *   "success": true,
 *   "message": "Registration successful",
 *   "data": {
 *     "member": { ... },
 *     "token": "eyJhbGci..."
 *   }
 * }
 */
async function register(req, res, next) {
  try {
    // 1. 요청 데이터 추출
    const { email, password, name, nickname, phone } = req.body;

    // 2. Auth Service 호출
    const result = await authService.register({
      email,
      password,
      name,
      nickname,
      phone
    });

    // 3. 성공 응답 반환 (201 Created)
    return successResponse(res, result, 'Registration successful', 201);
  } catch (error) {
    // 4. 에러를 errorHandler 미들웨어로 전달
    next(error);
  }
}

/**
 * 로그인
 *
 * @description
 * POST /api/v1/auth/login
 * 이메일과 비밀번호로 로그인합니다.
 *
 * @route POST /api/v1/auth/login
 * @access Public
 *
 * @param {Object} req.body - 로그인 데이터
 * @param {string} req.body.email - 이메일
 * @param {string} req.body.password - 비밀번호
 *
 * @returns {Object} 200 - { success: true, message: '...', data: { member, token } }
 * @returns {Object} 401 - { success: false, message: 'Invalid credentials' }
 *
 * @example
 * // Request
 * POST /api/v1/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "secure123!"
 * }
 *
 * // Response (200 OK)
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "member": {
 *       "member_id": 123,
 *       "member_email": "user@example.com",
 *       "role": "seller",
 *       "roles": ["buyer", "seller"]
 *     },
 *     "token": "eyJhbGci..."
 *   }
 * }
 */
async function login(req, res, next) {
  try {
    // 1. 요청 데이터 추출
    const { email, password } = req.body;

    // 2. Auth Service 호출
    const result = await authService.login(email, password);

    // 3. 성공 응답 반환 (200 OK)
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    // 4. 에러를 errorHandler 미들웨어로 전달
    next(error);
  }
}

/**
 * 비밀번호 변경
 *
 * @description
 * PUT /api/v1/auth/change-password
 * 로그인한 사용자의 비밀번호를 변경합니다.
 *
 * @route PUT /api/v1/auth/change-password
 * @access Private (authenticate 미들웨어 필요)
 *
 * @param {Object} req.user - JWT 토큰에서 추출한 사용자 정보 (authenticate 미들웨어가 설정)
 * @param {number} req.user.member_id - 회원 ID
 * @param {Object} req.body - 비밀번호 변경 데이터
 * @param {string} req.body.current_password - 현재 비밀번호
 * @param {string} req.body.new_password - 새 비밀번호
 * @param {string} req.body.confirm_password - 새 비밀번호 확인
 *
 * @returns {Object} 200 - { success: true, message: '...', data: { message } }
 * @returns {Object} 401 - { success: false, message: 'Current password is incorrect' }
 * @returns {Object} 400 - { success: false, message: 'New password must be different...' }
 *
 * @example
 * // Request
 * PUT /api/v1/auth/change-password
 * Authorization: Bearer eyJhbGci...
 * {
 *   "current_password": "oldpass123!",
 *   "new_password": "newpass456!",
 *   "confirm_password": "newpass456!"
 * }
 *
 * // Response (200 OK)
 * {
 *   "success": true,
 *   "message": "Password changed successfully",
 *   "data": {
 *     "message": "Password changed successfully"
 *   }
 * }
 */
async function changePassword(req, res, next) {
  try {
    // 1. JWT 토큰에서 회원 ID 추출 (authenticate 미들웨어가 req.user 설정)
    const memberId = req.user.member_id;

    // 2. 요청 데이터 추출
    const { current_password, new_password } = req.body;

    // 3. Auth Service 호출
    const result = await authService.changePassword(
      memberId,
      current_password,
      new_password
    );

    // 4. 성공 응답 반환 (200 OK)
    return successResponse(res, result, 'Password changed successfully');
  } catch (error) {
    // 5. 에러를 errorHandler 미들웨어로 전달
    next(error);
  }
}

module.exports = {
  register,
  login,
  changePassword
};
