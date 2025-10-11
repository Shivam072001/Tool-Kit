const express = require('express');
const router = express.Router();
const urlShortenerController = require('../controllers/urlShortener.controller');

router.post('/shorten', urlShortenerController.shorten);
router.get('/:shortCode', urlShortenerController.resolve);

module.exports = router;
