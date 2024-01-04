const { createTokenForUser } = require('../services/authentication');
const { mongoose } = require('../services/connectDB');

const { createHmac, randomBytes } = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    profileImgURL: { type: String, default: '/images/default-avatar.png' },
    role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
},
    { timestamps: true, }
);

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedPassword) throw new Error('Incorrect Password');

    const token = createTokenForUser(user);
    return token;
});

const User = mongoose.model('user', userSchema);

module.exports = User;