const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/', (req, res) => {
  res.render(path.join('..', 'views', 'home'), {
    title: 'Home page',
    isHome: true,
  });
});

module.exports = router;
