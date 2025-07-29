import mongoose from 'mongoose';
const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  name: { type: String },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
});
export default mongoose.model('Post', PostSchema);