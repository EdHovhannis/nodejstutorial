const { Router } = require('express');
const path = require('path');
const Course = require('../models/course');
const protectRoute = require('../middleware/auth');

const router = Router();

router.get('/', protectRoute, (req, res) => {
  res.render(path.join('..', 'views', 'add'), {
    title: 'Add page',
    isAdd: true,
  });
});

router.post('/', protectRoute, async (req, res) => {
  const { title, price, img } = req.body;
  const userId = req.user._id;
  const course = new Course({ title, price, img, userId });
  try {
    await course.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
