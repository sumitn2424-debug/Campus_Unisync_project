const express = require('express');
const router = express.Router();

const { submitFeedback, listFeedback,deleteFeedback } = require('../controllers/feedback.controller');
const authData = require('../middleware/authData.middleware');

router.post('/', authData, submitFeedback);
router.get('/get', authData, listFeedback);
router.delete('/delete', authData, deleteFeedback);
module.exports = router;
