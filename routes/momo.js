const express = require('express');

const router = express.Router();

const { makePayment, getPayment } = require('../controllers/momo');

router.get('/index', (req, res) => {
  res.status(200).json({"msg": "momo route"})
})

router.post('/', makePayment);
router.get('/:id', getPayment);

module.exports = router;