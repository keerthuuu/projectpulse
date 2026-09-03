import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  start_date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  },
  deadline: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['on_track', 'at_risk', 'delayed', 'completed'],
    default: 'on_track',
  },
  riskStatus: {
    type: String,
    default: 'ON TRACK',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  expectedCompletion: {
    type: String,
  },
  bufferDays: {
    type: Number,
    default: 5,
  },
  githubRepo: {
    type: String,
    default: 'projectpulse/cloud-migration-backend',
  },
  commitsThisWeek: {
    type: Number,
    default: 0,
  },
  openPrs: {
    type: Number,
    default: 0,
  },
  teamMembers: [{
    name: String,
    role: String,
    avatar: String,
  }],
  created_by: {
    type: String,
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
      ret.riskStatus = (ret.status || 'on_track').toUpperCase().replace('_', ' ');
      ret.expectedCompletion = ret.expectedCompletion || ret.deadline;
      delete ret.__v;
      return ret;
    }
  }
});

export const Project = mongoose.model('Project', projectSchema);
export default Project;
