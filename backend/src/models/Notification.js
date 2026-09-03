import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: String,
  type: {
    type: String,
    default: 'risk_change',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    default: 'Just now',
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  projectId: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      ret.read = ret.is_read;
      delete ret.__v;
      return ret;
    }
  }
});

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
