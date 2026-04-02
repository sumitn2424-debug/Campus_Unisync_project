const express = require('express');
const router = express.Router();

const { submitFeedback, listFeedback } = require('../controllers/feedback.controller');
const authData = require('../middleware/authData.middleware');

router.post('/', authData, submitFeedback);
router.get('/get', authData, listFeedback);

module.exports = router;
