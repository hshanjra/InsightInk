const JWT = require('jsonwebtoken');

const secret = process.env.SESSION_SECRET;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImgURL: user.profileImgURL,
        role: user.role
    }
    const token = JWT.sign(payload, secret);
    return token;
};

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
};

module.exports = {
    createTokenForUser,
    validateToken,
}