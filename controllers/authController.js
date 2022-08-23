const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.jwtSecretKey, { expiresIn: '24h' });
};
const check_required_fields = require('./utils/utils');

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Registration validation error', errors });
      }
      const required_fields = ['username', 'password'];
      const isBadRequest = check_required_fields(req, required_fields);

      if (isBadRequest) {
        return res.status(400).json({
          message: `Some of the required fields: ${required_fields} are missing`,
        });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({
        username,
        password: hash,
        roles: [userRole.value],
      });
      await user.save();
      return res.status(200).json({ message: 'New user registred' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User with username ${username} not found` });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'Login error' });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authController();
