import { shortUrlService } from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl, maxClicks, expiresAt } = req.body;
        const userId = req.user.id;
        const newUrl = await shortUrlService.createUrl(originalUrl, maxClicks, expiresAt, userId);
        res.status(201).json({ status: 'success', data: { url: newUrl } });
    } catch (error) {
        next(error);
    }
};

export const getUserUrls = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const urls = await shortUrlService.getUrlsForUser(userId);
        res.status(200).json({ status: 'success', results: urls.length, data: { urls } });
    } catch (error) {
        next(error);
    }
};

export const deleteShortUrl = async (req, res, next) => {
    try {
        await shortUrlService.deleteShortUrl(req.params.id, req.user.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};

export const disableShortUrl = async (req, res, next) => {
    try {
        const updatedUrl = await shortUrlService.toggleUrlStatus(req.params.id, req.user.id, true);
        res.status(200).json({ status: 'success', data: { url: updatedUrl } });
    } catch (error) {
        next(error);
    }
};

export const enableShortUrl = async (req, res, next) => {
    try {
        const { newMaxClicks } = req.body;
        const updatedUrl = await shortUrlService.toggleUrlStatus(req.params.id, req.user.id, false, newMaxClicks);
        res.status(200).json({ status: 'success', data: { url: updatedUrl } });
    } catch (error) {
        next(error);
    }
};