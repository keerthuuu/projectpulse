import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  task_id: {
    type: String,
    required: true,
  },
  user_id: String,
  author: {
    type: String,
    default: 'Alex Rivera',
  },
  role: {
    type: String,
    default: 'Developer',
  },
  comment_text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

export const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
