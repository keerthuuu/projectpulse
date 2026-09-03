import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  project_id: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    default: 'ProjectPulse Sprint',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  assigned_to: {
    type: String,
  },
  assignedTo: {
    type: String,
    default: 'Alex Rivera',
  },
  assignedAvatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'blocked', 'completed', 'NOT STARTED', 'IN PROGRESS', 'BLOCKED', 'COMPLETED'],
    default: 'not_started',
  },
  progress_percent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'Low', 'Medium', 'High'],
    default: 'medium',
  },
  planned_start: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  planned_end: {
    type: String,
    default: () => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  },
  dependencies: [{
    type: String,
  }],
  commentsCount: {
    type: Number,
    default: 0,
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
      ret.progress = ret.progress_percent;
      delete ret.__v;
      return ret;
    }
  }
});

export const Task = mongoose.model('Task', taskSchema);
export default Task;
