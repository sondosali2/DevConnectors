import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';
import authMiddleware from '../middleware/authmiddleware.js';
//create post
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
  
      if (!text) {
        return res.status(400).json({ msg: 'Text is required' });
      }
  
      const newPost = new Post({
        text,
        user: req.user.id
      });
  
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  //like post

  router.put('/like/:id', authMiddleware, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ msg: 'Post not found' });
  
      if (post.likes.includes(req.user.id)) return res.status(400).json({ msg: 'User already liked this post' });
  
      post.likes.push(req.user.id);
      await post.save();
  
      res.json(post.likes);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  //comment on post 
  router.put('/comment/:id', authMiddleware, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ msg: 'Post not found' });
  
      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar
      };
  
      post.comments.push(newComment);
      await post.save();
  
      res.json(post.comments);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
//get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
export default router;
