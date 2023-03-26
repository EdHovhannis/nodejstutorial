const path = require('path');
const { Router } = require('express');
const router = Router();
const Course = require('../models/course');
const protectRoute = require('../middleware/auth');

const computePrice = async (courses) => {
  return courses.reduce(
    (total, course) => (total + course.price) * course.count,
    0
  );
};
const cleanedData = async (courses) => {
  return courses.map((crs) => ({
    ...crs.courseId._doc,
    count: crs.count,
    id: crs.courseId._id,
  }));
};

router.post('/add', protectRoute, async (req, res) => {
  const course = await Course.findById(req.body?.id);
  await req.user.addToCart(course);
  return res.redirect('/cart');
});

router.get('/', protectRoute, async (req, res) => {
  const user = await req.user;
  const populatedCoursesFromUser = await user
    .populate('cart.items.courseId')
    .execPopulate();
  const courses = await cleanedData(populatedCoursesFromUser.cart.items);
  const price = await computePrice(courses);
  res.render(path.join('..', 'views', 'cart'), {
    isCart: true,
    layout: 'main',
    title: 'Cart',
    courses,
    price,
  });
});

router.delete('/remove/:id', protectRoute, async (req, res) => {
  const { id } = req.params;
  await req.user.removeFromCart(id);
  const user = await req.user;
  const populatedCoursesFromUser = await user
    .populate('cart.items.courseId')
    .execPopulate();
  const courses = await cleanedData(populatedCoursesFromUser.cart.items);
  const price = await computePrice(courses);
  const course = {
    courses,
    price,
  };
  res.json(course);
});

module.exports = router;
