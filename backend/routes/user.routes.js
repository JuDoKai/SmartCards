const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}` });
  });

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);


module.exports = router;