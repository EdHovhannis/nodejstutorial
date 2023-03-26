const { Router } = require('express');
const path = require('path');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const router = Router();

router.get('/login', async (req, res) => {
  res.render(path.join('..', 'views/auth', 'login'), {
    title: 'Auth',
    isAuth: true,
    regerror: req.flash('regerror'),
    logerror: req.flash('logerror'),
  });
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isSame = await bcryptjs.compare(password, user.password);
      if (isSame) {
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw new Error(err);
          res.redirect('/');
        });
      } else {
        req.flash('logerror', 'ddlogin user is already exist');
        return res.redirect('/auth/login#register');
      }
    } else {
      req.flash('logerror', 'login user is already exist');
      return res.redirect('/auth/login#register');
    }
  } catch (err) {}
});

router.post('/register', async (req, res) => {
  try {
    const { email, name, password, confirm } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('regerror', 'user is already exist');
      return res.redirect('/auth/login#register');
    } else {
      const hash = await bcryptjs.hash(password, 10);
      const user = new User({
        email,
        name,
        password: hash,
        confirm,
      });
      await user.save();
      return res.redirect('/auth/login#login');
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
