import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, 'Player Lastname is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Player email is required'],
        unique: true,
        trim: true,
    },
    category: {
        type: Number,
        default: 5
    },
}, {
  timestamps: true,
});

export default mongoose.models.Player || mongoose.model('Player', playerSchema);