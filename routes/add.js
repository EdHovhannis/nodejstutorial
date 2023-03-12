const { Router } = require('express');
const path = require('path');
const Course = require('../models/course');

const router = Router();

router.get('/', (req, res) => {
  res.render(path.join('..', 'views', 'add'), {
    title: 'Add page',
    isAdd: true,
  });
});
router.post('/', async (req, res) => {
  const { title, price, img } = req.body;
  const course = new Course({ title, price, img });
  try {
    await course.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
