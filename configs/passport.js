const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Load User model
const User = mongoose.model("users");

module.exports = passport => {
  // app/setupPassport.js
  passport.use(
    "local",
      new LocalStrategy({ usernameField: 'username' },(username,password,done) => {
      User.findOne({ email: username })
        .then(user => {
          console.log("User: ", user);
          if (!user) {
            return done(null, false, { error_msg: "Incorrect username" });
          }
          // Compare password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            console.log("Error: ", err);
            if (err) throw err;
            if (isMatch) {
                console.log('Is Match: ', isMatch)
              return done(null, user, { success_msg: "Login successful!" });
            } else {
                 console.log('Wrong Password')
              return done(null, false, { error_msg: "Wrong Password" });
            }
          });
        })
        .catch(err => done(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
