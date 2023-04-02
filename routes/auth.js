const { Router } = require('express');
const path = require('path');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const router = Router();
const { etherealemail } = require('../helpers/emailhelper');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { registervalidator } = require('../helpers/validator');

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

router.post('/register', registervalidator, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('regerror', errors.array()[0].msg);
      return res.status(421).redirect('/auth/login#register');
    }

    const hash = await bcryptjs.hash(password, 10);
    const user = new User({
      email,
      name,
      password: hash,
    });
    await user.save();
    res.redirect('/auth/login#login');
    const subject = 'Hello ✔';
    const text = 'Hello world?';
    const html = '<b>Hello world?</b>';
    etherealemail({ subject, text, html });
  } catch (err) {
    console.log(err);
  }
});

router.get('/reset', async (req, res) => {
  res.render(path.join('..', 'views/auth', 'reset'), {
    title: 'forgot password',
    error: req.flash('reseterr'),
  });
});

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('reseterr', 'Something went wrong');
        return res.redirect('/auth/restet');
      }
      const token = buffer.toString('hex');
      const { email } = req.body;
      const isUser = await User.findOne({ email });
      if (isUser) {
        isUser.resetToken = token;
        isUser.resetTokenExp = new Date() * 60 * 60 * 1000;
        await isUser.save();
        const subject = 'Hello ✔';
        const text = 'Hello world?';
        const html = `<a href="{http://localhost:3000/auth/password/${token}}" target="_blank">http://localhost:3000/auth/password/${token}</a>`;
        etherealemail({ subject, text, html });
        res.redirect('/auth/reset');
      } else {
        req.flash('reseterr', 'Something went wrong mno');
        return res.redirect('/auth/restet');
      }
    });
  } catch (err) {
    console.log('err', err);
  }
});

router.get('/password/:token', async (req, res) => {
  try {
    if (!req.params.token) {
      return;
    }
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) {
      return res.redirect('/auth/login');
    }
    res.render(path.join('..', 'views/auth', 'password'), {
      title: 'Password page',
      userId: user._id.toString(),
      token: req.params.token,
    });
    user.save();
  } catch (err) {
    console.log(err);
  }
});

router.post('/password', async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!user) {
      return res.redirect('/auth/login');
    }
    user.password = await bcryptjs.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();
    return res.redirect('/auth/login#login');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
