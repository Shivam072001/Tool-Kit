import { AppError } from '../utils/AppError.js';

export const handleRedirect = async (req, res, next) => {
    const { code } = req.params;
    const { redirect } = req.query;

    try {
        switch (redirect) {
            case 'qr':
                const qrUrl = await trackScanAndGetUrl(code);
                return res.redirect(307, qrUrl);

            default:
                const originalUrl = await getOriginalUrl(code);
                return res.redirect(301, originalUrl);
        }
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        return next(new AppError('The requested link could not be found.', 404));
    }
};

const redirectToOriginalUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const originalUrl = await shortUrlService.getOriginalUrl(shortCode);
        res.redirect(301, originalUrl);
    } catch (error) {
        next(error);
    }
};

const trackQRCodeScan = async (req, res, next) => {
    try {
        const originalUrl = await qrCodeService.trackScanAndGetUrl(req.params.id);
        res.redirect(307, originalUrl);
    } catch (error) {
        next(error);
    }
};