const { Router } = require('express');
const Courses = require('../models/course');
const path = require('path');
const mongoose = require('mongoose');
const protectRoute = require('../middleware/auth');

const router = Router();

router.get('/', async (req, res) => {
  const courses = await Courses.find().populate('userId', 'name');
  res.render(path.join('..', 'views', 'courses'), {
    title: 'Courses page',
    isCourses: true,
    courses,
  });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return;
  const course = await Courses.findById(id);
  try {
    res.render(path.join('..', 'views', 'course'), {
      layout: 'details',
      title: 'Courses Details',
      course,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id/edit', protectRoute, async (req, res) => {
  if (req.query.allow === undefined || req.query.allow === 'false') {
    return res.redirect('/');
  }
  const { id } = req.params;
  const course = await Courses.findById(id);
  res.render(path.join('..', 'views', 'edit'), {
    layout: 'main',
    title: 'Edit page',
    course,
  });
});

router.post('/edit', protectRoute, async (req, res) => {
  const data = req.body;
  await Courses.findByIdAndUpdate(data.id, data);
  return res.redirect('/courses');
});

router.post('/remove', protectRoute, async (req, res) => {
  const { id } = req.body;
  try {
    await Courses.findByIdAndRemove(id);
    return res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
