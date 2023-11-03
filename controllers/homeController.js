const Post = require('../models/post')
const User = require('../models/users')
const Comment = require('../models/comment')
const Like = require('../models/like')
const Friendship = require('../models/friendship')
const Conversation = require('../models/conversation')
module.exports.home = async function (req, res) {
  let user = req.user
  if (req.isAuthenticated()) {
    console.log('authenticated')
    try {
      let UserInfo = await User.findById(user.id)
        .populate({
          path: 'posts',
          options: { sort: { createdAt: -1 } },
          populate: [
            {
              path: 'comments likes',
              options: { sort: { createdAt: -1 } },
              populate: {
                path: 'user',
              },
            },
            {
              path: 'user',
            },
          ],
        }).populate({
          path: 'friendships',
          options: { sort: { createdAt: -1 } },
        });
      let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
        path: 'comments',
        populate: [
          { path: 'user' },
          { path: 'likes' }
        ]
      }).populate('likes')

      console.log('posts',posts)
      let users = await User.find({ _id: { $ne: req.user.id } })
      return res.render('home', {
        title: "Home",
        UserInfo: UserInfo,
        all_users: users,
        posts: posts
      })
    } catch (err) {
      console.log('err', err)
    }
  } else {
    return res.render('user_sign_in', {
      title: "Sign in",
    })
  }
}

