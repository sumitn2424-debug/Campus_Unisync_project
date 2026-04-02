const FeedbackModel = require('../models/feedback.model');

const submitFeedback = async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'name, email and message are required' });
        }

        const newFeedback = new FeedbackModel({ name, email, message, rating });
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

module.exports = { submitFeedback, listFeedback };
