const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const userSchema = mongoose.Schema(
    {
        username: { 
            type: String,
            required: [true, "Le nom d'utilisateur est requis"],
            unique: true,
            minlength: [3, "Minimum 3 caractères"],
            maxlength: [20, "Maximum 20 caractères"],
            match: [/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_]+$/, "Le nom d'utilisateur ne doit contenir que des lettres, chiffres et _"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "L'email est requis"],
            unique: true,
            match: [/.+\@.+\..+/, "Veuillez entrer une adresse email valide"],
            lowercase: true,
            trim: true,
          },
          password: {
            type: String,
            required: [true, "Le mot de passe est requis"],
            minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
            match: [
                /^(?=.*[a-zA-ZÀ-ÖØ-öø-ÿ])(?=.*[A-ZÀ-ÖØ-Þ])(?=.*\d)(?=.*[^A-Za-zÀ-ÖØ-öø-ÿ0-9])[\S]{8,}$/,
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
            ],
          },
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