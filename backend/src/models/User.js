import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'team_leader', 'employee'],
    default: 'employee',
  },
  password_hash: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
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
      ret.name = ret.full_name;
      delete ret.password_hash;
      delete ret.__v;
      return ret;
    }
  }
});

export const User = mongoose.model('User', userSchema);
export default User;
