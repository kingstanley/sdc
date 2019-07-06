const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("users");
const Post = mongoose.model("posts");

router.get("/signin", (req, res) => {
  res.render("account/signin");
});

// Create User
router.get("/create", (req, res) => {
  res.render("account/create");
});

router.post("/create", (req, res) => {
  let errors = [];
  let image = req.files.image;
  // check if email, username and password are empty
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 8) {
    errors.push({ text: "Password must be at least 8 characters long" });
  }
  if (errors.length > 0) {
    res.render("account/create", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      password2: req.body.password2,
      email: req.body.email,
      image: req.body.image
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "This email is already registered. Try signin");
        res.redirect("signin");
      } else {
        let upload_time = Date.now();
        let image_url = null;
        image_url = image.mv(
          `public/img/profile/${upload_time}_${image.name}`,
          err => {
            if (err) {
              return res.status(500).send(err);
            } else {
              image_url = `/img/profile/${upload_time}_${image.name}`;

              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if (err) {
                    throw err;
                  } else {
                    const newUser = new User({
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      email: req.body.email,
                      username: req.body.username,
                      password: hash,
                      image: image_url
                    });
                    newUser
                      .save()
                      .then(user => {
                        if (user) {
                          req.flash(
                            "success_msg",
                            "Your account is successfully created, Try sign in"
                          );
                          res.redirect("signin");
                        }
                      })
                      .catch(err => console.log(err));
                  }
                });
              });
            }
          }
        );
      }
    });
  }
});
router.post("/signin", (req, res, next) => {
  console.log("Data: ", req.body);
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/signin"
  })(req, res, next);
});

//Account/Signout
router.get("/signout", (req, res) => {
  req.logout();
  req.flash("success_msg", `You are now logged out`);
  res.redirect("/");
});
module.exports = router;
