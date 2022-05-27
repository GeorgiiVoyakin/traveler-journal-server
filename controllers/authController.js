import User, { findOne, find } from '../models/User';
import { findOne as _findOne } from '../models/Role';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
require('dotenv').config();
const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return sign(payload, process.env.jwtSecretKey, { expiresIn: '24h' });
};
class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'Registration validation error', errors });
      }
      const { username, password } = req.body;
      const candidate = await findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      const salt = genSaltSync(10);
      const hash = hashSync(password, salt);
      const userRole = await _findOne({ value: 'USER' });
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
      const user = await findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User with username ${username} not found` });
      }
      const isValidPassword = compareSync(password, user.password);
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
      const users = await find();
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  }
}

export default new authController();
