const Url = require('../models/url.model');

const createShortUrl = async (originalUrl, shortCode) => {
  const url = new Url({ originalUrl, shortCode });
  return await url.save();
};

const findByShortCode = async (shortCode) => {
  return await Url.findOne({ shortCode });
};

const findByOriginalUrl = async (originalUrl) => {
  return await Url.findOne({ originalUrl });
};

module.exports = {
  createShortUrl,
  findByShortCode,
  findByOriginalUrl,
};
