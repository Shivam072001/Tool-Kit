import mongoose from 'mongoose';

const textDiffSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalText: {
    type: String,
    default: '',
  },
  changedText: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

const TextDiff = mongoose.model('TextDiff', textDiffSchema);

export default TextDiff;