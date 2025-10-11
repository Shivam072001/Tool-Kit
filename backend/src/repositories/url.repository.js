import Url from '../models/url.model.js';

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

export default {
  createShortUrl,
  findByShortCode,
  findByOriginalUrl,
};
