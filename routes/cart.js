const path = require('path');
const { Router } = require('express');
const router = Router();
const Cart = require('../models/cart');
const Course = require('../models/course');

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body?.id);
  await Cart.add(course);
  return res.redirect('/cart');
});

router.get('/', async (req, res) => {
  const cart = await Cart.fetch();
  res.render(path.join('..', 'views', 'cart'), {
    layout: 'main',
    title: 'Edit page',
    cart,
  });
});

router.delete('/remove/:id', async (req, res) => {
  const { id } = req.params;
  if (id) {
    const cart = await Cart.findByIdAndDelete(id);
    res.json(cart);
  }
});
module.exports = router;
