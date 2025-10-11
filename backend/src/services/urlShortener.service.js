import urlRepository from '../repositories/url.repository.js';

function generateShortCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const shortenUrl = async (originalUrl) => {
  let existing = await urlRepository.findByOriginalUrl(originalUrl);
  if (existing) return existing;

  let shortCode;
  let found;
  do {
    shortCode = generateShortCode();
    found = await urlRepository.findByShortCode(shortCode);
  } while (found);

  return await urlRepository.createShortUrl(originalUrl, shortCode);
};

const resolveUrl = async (shortCode) => {
  return await urlRepository.findByShortCode(shortCode);
};

export default {
  shortenUrl,
  resolveUrl,
};
