const { body } = require('express-validator');
const User = require('../models/user');

module.exports.registervalidator = [
  body('email')
    .isEmail()
    .withMessage('email not correct')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject('user already exists');
      }
    })
    .normalizeEmail(),
  body('password', 'not correct password')
    .isLength({ max: 20, min: 6 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        console.log(value);
        console.log(req.body.password);
        throw new Error('Passwords must be equal');
      }
      return true;
    })
    .trim(),
  body('name').isLength({ min: 3 }).withMessage('Name must be 3 characters'),
];

module.exports.coursevalidator = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),
  body('price').isNumeric().withMessage('price must be at least 3 characters'),
];
