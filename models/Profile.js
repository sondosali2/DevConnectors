import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true, // Ensure this is set to true
        required: true // Ensure user is always required
    },
    bio: {
        type: String
    },
    skills: {
        type: [String]
    },
    social: {
        twitter: {
            type: String
        },
        facebook: {
            type: String
        }
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
export default mongoose.model('Profile', ProfileSchema);
