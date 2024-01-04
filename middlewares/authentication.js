const { validateToken } = require("../services/authentication");

function checkForAuthCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookiesValue = req.cookies[cookieName];
        if (!tokenCookiesValue) return next();

        try {
            const userPayload = validateToken(tokenCookiesValue);
            req.user = userPayload;
        } catch (error) { }
        return next();
    };
}
module.exports = {
    checkForAuthCookie
}