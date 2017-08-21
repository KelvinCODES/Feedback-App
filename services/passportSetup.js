const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

//Uses the database ID to a user row
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      //proxy makes it so that google redirectrs back to https instead of http
      // Causes:
      // 1) callbackURL uses relative path
      // 2) Heroku uses a proxy to route to the correct Server our app is hosted on
      proxy: true
    },
    // accessToken, refreshToken, profile, done returned by Google
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleID: profile.id });
      if (existingUser) {
        return await done(null, existingUser);
      }
      const user = await new User({ googleID: profile.id }).save();
      await done(null, user);
    }
  )
);
