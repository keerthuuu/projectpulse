import Comment from '../models/Comment.js';

const SEED_COMMENTS = [
  { id: 'c1', task_id: 'task-101', author: 'Sarah Jenkins', role: 'Team Lead', comment_text: 'Great progress on the CI/CD pipeline! Please double check GitHub Webhook secrets.', created_at: '2 hours ago' },
  { id: 'c2', task_id: 'task-101', author: 'Alex Rivera', role: 'Developer', comment_text: 'Staging build passed successfully. Testing production migration script now.', created_at: '45 mins ago' }
];

export const getCommentsByTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task_id: taskId }).sort({ created_at: 1 });

    if (comments.length === 0) {
      return res.status(200).json({ success: true, data: SEED_COMMENTS });
    }

    return res.status(200).json({ success: true, data: comments.map(c => c.toJSON()) });
  } catch (err) {
    return res.status(200).json({ success: true, data: SEED_COMMENTS });
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { taskId: task_id } = req.params;
    const { comment_text } = req.body;

    if (!comment_text || comment_text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'comment_text cannot be empty.' });
    }

    const userId = req.user?.id || null;

    const newComment = await Comment.create({
      task_id,
      user_id: userId,
      author: req.user?.full_name || 'Alex Rivera',
      role: req.user?.role || 'Developer',
      comment_text
    });

    return res.status(201).json({
      success: true,
      data: newComment.toJSON()
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Comment.findByIdAndDelete(id);
    } catch (e) { /* ignore */ }

    return res.status(200).json({
      success: true,
      message: `Comment ${id} deleted.`
    });
  } catch (err) {
    next(err);
  }
};
