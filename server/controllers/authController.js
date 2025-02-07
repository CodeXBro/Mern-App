const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require('jsonwebtoken');

const test = (req, res) => {
  res.json("test is working");
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }

    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    const exsit = await User.findOne({ email });
    if (exsit) {
      return res.json({
        error: "Email is already taken",
      });
    }

    if (!location || !location.lat || !location.lng) {
      return res.json({
        error: "Location is required",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No User Found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(user);
      });
    }

    if (!match) {
      res.json({
        error: 'Passwords do not match',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
};