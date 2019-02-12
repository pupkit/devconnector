const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   GET '/api/users/test'
// @desc    Route Tester
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "users works" }));

// @route   POST '/api/users/register'
// @desc    Registers a user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.log("Error Occured");
          else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          }
        });
      });
    }
  });
});

// @route   POST '/api/users/login'
// @desc    User Login / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email }).then(user => {
    // Check for a user from request data
    if (!user) {
      errors.email = "User Not Found";
      return res.status(400).json(errors);
    }

    // Compare password
    bcrypt.compare(password, user.password).then(isMatched => {
      if (!isMatched) {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      } else {
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      }
    });
  });
});

// @route   Get '/api/users/current'
// @desc    Return Current User
// @access  Public
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
module.exports = router;
