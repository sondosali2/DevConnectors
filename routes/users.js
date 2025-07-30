
import express from 'express';
const router = express.Router();
import User from '../models/User.js';

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
router.post('/logout', (req, res) => {
    res.clearCookie('connect.sid'); // or your session cookie name
    res.status(200).json({ message: 'Logged out successfully' });
  });


export default router;