const express = require('express');
const cors = require('cors');
const cookiesParser = require('cookie-parser');
const app = express();
const userRouter = require('./routes/user.routes');
const dataRouter = require('./routes/data.routes');
const createPostRouter = require('./routes/createPosts.routes');
const purchaseRouter = require('./routes/purchase.routes');
const feedbackRouter = require('./routes/feedback.routes');
const likeCommentAndSavedRouter = require('./routes/likeCommentAndSaved.routes');


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookiesParser());




app.use('/api/auth', userRouter)
app.use('/api/data', dataRouter)
app.use('/api/post', createPostRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/like-comment-saved', likeCommentAndSavedRouter);

module.exports = app;