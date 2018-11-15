const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  favoriteDrink: String,
  imgName: String,
  imgPath: {
    type: String,
    default : 'https://res.cloudinary.com/dpjdxqrce/image/upload/v1542213097/worst-video-users/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
  },
  favoriteCafe: {type: Schema.Types.ObjectId, ref: "Cafe"},
  role: {type: String,
         enum : ['Admin', 'Creator', 'User'],
         default : 'User'
  },
  status: {
    type: String,
    enum : ['Pending Confirmation', 'Active'],
    default : 'Pending Confirmation'
  },
  confirmationCode: String,
  email: { type: String, 
            match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, 
            unique: true 
  },
  googleId: String,
}, 
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
