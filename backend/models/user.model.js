const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide"],
        },
        password: { type: String, required: true },
        decks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }],
    },
    { timestamps: true } 
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
    });

    userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
    };

    const User = mongoose.model('User', userSchema);

module.exports = User;