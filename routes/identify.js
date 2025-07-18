const express = require('express');
const router = express.Router();
const identifyController = require('../controllers/identify');

router.post('/', identifyController);

module.exports = router;
