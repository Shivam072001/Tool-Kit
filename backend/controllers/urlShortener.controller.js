const urlShortenerService = require('../services/urlShortener.service');

const shorten = async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  try {
    const url = await urlShortenerService.shortenUrl(originalUrl);
    res.status(201).json({ shortCode: url.shortCode, originalUrl: url.originalUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
};

const resolve = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const url = await urlShortenerService.resolveUrl(shortCode);
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    res.status(200).json({ originalUrl: url.originalUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve URL' });
  }
};

module.exports = {
  shorten,
  resolve,
};
