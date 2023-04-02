const { Router } = require('express');
const path = require('path');
const Course = require('../models/course');
const protectRoute = require('../middleware/auth');
const { coursevalidator } = require('../helpers/validator');
const { validationResult } = require('express-validator');

const router = Router();

router.get('/', protectRoute, (req, res) => {
  res.render(path.join('..', 'views', 'add'), {
    title: 'Add page',
    isAdd: true,
    error: req.flash('courseerr'),
  });
});

router.post('/', protectRoute, coursevalidator, async (req, res) => {
  const { title, price, img } = req.body;
  const userId = req.user._id;
  const course = new Course({ title, price, img, userId });
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('courseerr', errors.array()[0].msg);
    return res.status(421).redirect('/add');
  }

  try {
    await course.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
