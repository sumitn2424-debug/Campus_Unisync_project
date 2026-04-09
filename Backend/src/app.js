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
const chatRoutes = require("./routes/chat.routes");
const adminRouter = require('./routes/admin.routes');

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookiesParser());




app.use('/api/auth', userRouter)
app.use('/api/data', dataRouter)
app.use('/api/post', createPostRouter);
app.use('/api/purchase', purchaseRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/like', likeCommentAndSavedRouter);
app.use("/api/chat", chatRoutes);
app.use('/api/admin', adminRouter);

module.exports = app;