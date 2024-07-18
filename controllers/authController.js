const User = require("../models/User");
const { SuccessResponse, FailedResponse } = require("../utils/response");

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new FailedResponse("User already exists"));
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    res.json(
      new SuccessResponse({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      })
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json(new FailedResponse("Server Error"));
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(new FailedResponse("Invalid credentials"));
    }

    if (user.password !== password) {
      return res.status(400).json(new FailedResponse("Invalid credentials"));
    }

    res.json(
      new SuccessResponse({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json(new FailedResponse("Server Error"));
  }
};

module.exports = {
  signup,
  login,
};
