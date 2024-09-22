import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
  club: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Club email is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Club phone is required'],
  },
  category: {
    type: Number,
    required: [true, 'Category is required'],
    trim: true,
    min: 1,
    max: 5
  },
  courtNumber: {
    type: Number,
    required: [true, 'Court number is required'],
    trim: true,
  },
  matchStart: {
    type: Date,
    required: [true, 'Match start is required'],
    trim: true,
  },
  matchEnd: {
    type: Date,
    required: [true, 'Match end is required'],
    trim: true,
  },
  players: {
    type: [String],
    max: 4,
    require: false
  },
}, {
  timestamps: true,
});

export default mongoose.models.court || mongoose.model('court', courtSchema);