import { secureShareService } from '../services/secureShare.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createShare = async (req, res, next) => {
    try {
        const { recipientEmail, passwordItem, expiresIn } = req.body;
        const sharerId = req.user.id;

        const accessToken = await secureShareService.createShare(sharerId, recipientEmail, passwordItem, expiresIn);

        res.status(201).json(new ApiResponse(201, { accessToken }, 'Share link created'));
    } catch (error) {
        next(error);
    }
};

export const claimShare = async (req, res, next) => {
    try {
        const { accessToken } = req.params;
        const recipientId = req.user.id;

        const passwordItem = await secureShareService.claimShare(accessToken, recipientId);

        res.status(200).json(new ApiResponse(200, { passwordItem }));
    } catch (error) {
        next(error);
    }
};