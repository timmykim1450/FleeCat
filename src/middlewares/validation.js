const { body, validationResult } = require('express-validator');

/**
 * 검증 결과를 처리하는 헬퍼 함수
 * 검증 에러가 있으면 400 응답을 반환하고, 없으면 다음 미들웨어로 진행
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * 회원가입 입력 검증
 *
 * 검증 항목:
 * - email: 필수, 이메일 형식, 최대 255자
 * - password: 필수, 8자 이상, 영문+숫자 포함
 * - name: 필수, 2~30자
 * - nickname: 필수, 2~20자
 * - phone: 선택, 전화번호 형식 (010-1234-5678 또는 01012345678)
 */
const validateRegister = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),

  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Name must be between 2 and 30 characters')
    .trim(),

  body('nickname')
    .notEmpty()
    .withMessage('Nickname is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Nickname must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9가-힣]+$/)
    .withMessage('Nickname can only contain letters, numbers, and Korean characters')
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/)
    .withMessage('Invalid phone number format (e.g., 010-1234-5678 or 01012345678)')
    .trim(),

  handleValidationErrors
];

/**
 * 로그인 입력 검증
 *
 * 검증 항목:
 * - email: 필수, 이메일 형식
 * - password: 필수
 */
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

/**
 * 회원 정보 수정 입력 검증
 *
 * 검증 항목:
 * - nickname: 선택, 2~20자
 * - phone: 선택, 전화번호 형식
 *
 * 참고: 이메일과 비밀번호는 별도 API로 변경
 */
const validateUpdateMember = [
  body('nickname')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 20 })
    .withMessage('Nickname must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9가-힣]+$/)
    .withMessage('Nickname can only contain letters, numbers, and Korean characters')
    .trim(),

  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/)
    .withMessage('Invalid phone number format (e.g., 010-1234-5678 or 01012345678)')
    .trim(),

  body('email')
    .not()
    .exists()
    .withMessage('Email cannot be updated through this endpoint. Use /auth/change-email'),

  body('password')
    .not()
    .exists()
    .withMessage('Password cannot be updated through this endpoint. Use /auth/change-password'),

  handleValidationErrors
];

/**
 * 비밀번호 변경 입력 검증
 *
 * 검증 항목:
 * - current_password: 필수
 * - new_password: 필수, 8자 이상, 영문+숫자 포함
 * - confirm_password: 필수, new_password와 일치
 */
const validateChangePassword = [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),

  body('new_password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('New password must contain at least one letter and one number'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Confirm password does not match new password');
      }
      return true;
    }),

  body('new_password')
    .custom((value, { req }) => {
      if (value === req.body.current_password) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),

  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateMember,
  validateChangePassword
};
