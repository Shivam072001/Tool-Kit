/**
 * @swagger
 * tags:
 * name: Redirection Service
 * description: Handles the redirection for Short URLs and QR Codes.
 */

/**
 * @swagger
 * /r/{code}:
 * get:
 * summary: Redirect to original URL
 * description: This is a public endpoint that redirects a short code (from a Short URL or QR Code) to its original destination URL. It also increments the click/scan count.
 * tags: [Redirection Service]
 * parameters:
 * - in: path
 * name: code
 * required: true
 * schema:
 * type: string
 * description: The short code to be redirected.
 * example: "abC12D"
 * responses:
 * '302':
 * description: Found. Redirects to the original URL.
 * headers:
 * Location:
 * schema:
 * type: string
 * format: uri
 * description: The original URL to redirect to.
 * '404':
 * description: The code is invalid, expired, or has reached its usage limit.
 */