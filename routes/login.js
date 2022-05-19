const express = require('express');

const { 
  validateAuth,
} = require('../middlewares');
const { generateToken } = require('../helpers/tokenGenerator');

const router = express.Router();

router.post('/', validateAuth, (req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
});

module.exports = router;