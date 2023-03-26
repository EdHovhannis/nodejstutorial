const { Router } = require('express');
const Order = require('../models/order');
const path = require('path');
const protectRoute = require('../middleware/auth');

const router = Router();
const currencyHelper = (p) =>
  new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  }).format(p);

router.get('/', protectRoute, async (req, res) => {
  const orders = await Order.find({ 'user.userId': req.user._id }).populate(
    'user.userId'
  );

  res.render(path.join('..', 'views', 'orders'), {
    title: 'Orders',
    isOrders: true,
    orders: orders.map((o) => ({
      ...o._doc,
      price: currencyHelper(
        o.courses.reduce((total, c) => (total += c.count * c.course.price), 0)
      ),
    })),
  });
});

router.post('/', protectRoute, async (req, res) => {
  try {
    const user = await req.user.populate('cart.items.courseId').execPopulate();
    const courses = user.cart.items.map((crs) => {
      return {
        course: {
          ...crs.courseId._doc,
        },
        count: crs.count,
      };
    });
    const order = new Order({
      courses,
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
    });
    await order.save();
    await req.user.clearCart();
    return res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
