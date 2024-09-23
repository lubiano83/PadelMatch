import mongoose from 'mongoose';

const ClubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Validación básica de correo electrónico
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{9,15}$/ // Número de teléfono con longitud entre 9 y 15
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    courtNumber: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Club', ClubSchema);
