const User = require('../models/User');

class userController {
  async getUsername(req, res) {
    const user = await User.findById({ _id: req.user.id }).exec();
    return res.status(200).json({ username: user.username });
  }
}

module.exports = new userController();
