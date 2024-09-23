import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, 'Player email is required'],
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: [true, 'Player image is required'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, 'Player lastname is required'],
        trim: true,
    },
    category: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 5,
        message: 'Category must be either 1, 2, 3, 4, or 5',
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"],
        message: 'Gender must be either male or female',
    },
    position: {
        type: String,
        required: true,
        enum: ['Forehand', 'Backhand', 'Indifferent'],
        message: 'Position must be either Forehand, Backhand, or Indifferent'
    },
    phone: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    _id: false  // Evita que Mongoose genere automáticamente un _id
});

export default mongoose.models.player || mongoose.model('player', playerSchema);