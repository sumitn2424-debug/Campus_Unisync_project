const FeedbackModel = require('../models/feedback.model');

const submitFeedback = async (req, res) => {
    const decoded = req.user
    try {
        const { name, email, message, rating } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'name, email and message are required' });
        }

        const newFeedback = new FeedbackModel({ name, email, message, rating, userId:decoded.id});
        const savedFeedback = await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', data: savedFeedback });
    } catch (error) {
        console.error('feedback submit error:', error);
        res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
    }
};

const listFeedback = async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Feedback list retrieved', data: feedbacks });
    } catch (error) {
        console.error('feedback list error:', error);
        res.status(500).json({ message: 'Failed to load feedback', error: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    const decoded = req.user; // Access the decoded user information from the middleware
    try {
        const { feedbackId } = req.body;
        const deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackId);
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        if (deletedFeedback.email !== decoded.email) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own feedback' });
        }
        await deletedFeedback.deleteOne();
        res.status(200).json({ message: 'Feedback deleted successfully', data: deletedFeedback });
    } catch (error) {
        console.error('feedback delete error:', error);
        res.status(500).json({ message: 'Failed to delete feedback', error: error.message });
    }
};


module.exports = { submitFeedback, listFeedback, deleteFeedback };
