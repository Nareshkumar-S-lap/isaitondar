const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'organizer', 'member', 'guest'])
    .withMessage('Invalid role'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Event validation rules
exports.validateEvent = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Event name must be between 3 and 200 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('temple')
    .isMongoId()
    .withMessage('Valid temple ID is required'),
  body('date')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('membersNeeded')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Members needed must be between 1 and 1000'),
  body('instruments')
    .optional()
    .isArray()
    .withMessage('Instruments must be an array'),
  body('foodRequired')
    .optional()
    .isBoolean()
    .withMessage('Food required must be a boolean')
];

// Expense validation rules
exports.validateExpense = [
  body('event')
    .isMongoId()
    .withMessage('Valid event ID is required'),
  body('type')
    .isIn([
      'Food & Catering',
      'Transportation',
      'Instruments Rental',
      'Decorations',
      'Sound System',
      'Venue Charges',
      'Printing & Materials',
      'Miscellaneous'
    ])
    .withMessage('Invalid expense type'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid date format')
];

// Thevaram validation rules
exports.validateThevaram = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('titleTamil')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Tamil title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('English content is required'),
  body('contentTamil')
    .trim()
    .notEmpty()
    .withMessage('Tamil content is required'),
  body('transliteration')
    .trim()
    .notEmpty()
    .withMessage('Transliteration is required'),
  body('category')
    .isIn(['thevaram', 'guru-pathigam'])
    .withMessage('Invalid category'),
  body('guru')
    .optional()
    .isIn(['Thirugnana Sambandar', 'Appar', 'Sundarar', 'Manikkavacakar', ''])
    .withMessage('Invalid guru'),
  body('audioUrl')
    .optional()
    .isURL()
    .withMessage('Audio URL must be a valid URL')
];

// Temple validation rules
exports.validateTemple = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Temple name must be between 3 and 200 characters'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.pincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be 6 digits'),
  body('contact.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('contact.email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('deity.primary')
    .trim()
    .notEmpty()
    .withMessage('Primary deity is required')
];

// Instrument validation rules
exports.validateInstrument = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Instrument name must be between 2 and 100 characters'),
  body('category')
    .isIn(['Percussion', 'String', 'Wind', 'Other'])
    .withMessage('Invalid category'),
  body('playingTechnique.difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level')
];

// Common validation rules
exports.validateObjectId = (field) => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} ID`)
];

exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string')
];