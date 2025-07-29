import express from 'express';
const router = express.Router();
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authmiddleware.js';
router.post('/', authMiddleware, async (req, res) => {
    try {

        const { bio, skills, social } = req.body;

        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            res.json(`Updating profile for user ID: ${req.user.id}`);
            profile.bio = bio;
            profile.skills = skills;
            profile.social = social;
        } else {
            profile = new Profile({
                user: req.user.id,
                bio,
                skills,
                social,
                following: [],
                followers: []
            });
        }

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error('Profile creation error:', err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/me', authMiddleware, async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
  
      if (!profile) {
        return res.status(400).json({ msg: 'Profile not found' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
// Follow a user
router.put('/follow/:id', authMiddleware, async (req, res) => {
    try {
      const userToFollow = await Profile.findOne({ user: req.params.id });
      const currentUser = await Profile.findOne({ user: req.user.id });
  
      if (!userToFollow) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Check if already following
      if (currentUser.following.includes(req.params.id)) {
        return res.status(400).json({ msg: 'Already following this user' });
      }
  
      // Add to following list
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
  
      await currentUser.save();
      await userToFollow.save();
  
      res.json({ msg: 'User followed successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Unfollow a user
router.put('/unfollow/:id', authMiddleware, async (req, res) => {
    try {
      // Find profiles
      const userProfile = await Profile.findOne({ user: req.user.id });
      const targetProfile = await Profile.findOne({ user: req.params.id });
  
      if (!userProfile) {
        return res.status(404).json({ msg: 'Your profile not found' });
      }
  
      if (!targetProfile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
  
      // Check if already unfollowed
      if (!userProfile.following.includes(req.params.id)) {
        return res.status(400).json({ msg: 'Not following this user' });
      }
  
      // Remove from following
      userProfile.following = userProfile.following.filter(
        id => id.toString() !== req.params.id
      );
  
      // Remove from followers
      targetProfile.followers = targetProfile.followers.filter(
        id => id.toString() !== req.user.id
      );
  
      await userProfile.save();
      await targetProfile.save();
  
      res.json({ msg: 'User unfollowed successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  });
// Get a user's followers
router.get('/followers/:id', async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.id }).populate('followers', 'name email');
  
      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }
    
      res.json(profile.followers);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
// Get a user's following list

router.get('/following/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('following', 'name email');
    
        if (!profile) {
          return res.status(404).json({ msg: 'Profile not found' });
        }
        
        res.json(profile.following);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
    
export default router;
