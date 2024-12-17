const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = new UserModel({ username, email, password });
    await user.save();
    res.json({ message: 'Registration successful' });
} catch (error) {
    next(error);
}
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1 hour',
    });
    res.json({ token });
} catch (error) {
    next(error);
}
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users.',
      error: error.message,
    });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user.',
      error: error.message,
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Entrez un nom d'utilisateur." });
    }
    if (!email) {
      return res.status(400).json({ message: "Entrez un email." });
    }
    if (!password) {
      return res.status(400).json({ message: 'Entrez un mot de passe.' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet Email est déjà associer à un autre utilisateur.' });
    }

    const newUser = new UserModel({
      username,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully.',
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user.',
      error: error.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
      new: true, 
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user.',
      error: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user.',
      error: error.message,
    });
  }
};