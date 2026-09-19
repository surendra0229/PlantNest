const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

if (googleClientId && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = (profile.emails && profile.emails[0] && profile.emails[0].value)
            ? profile.emails[0].value.toLowerCase()
            : '';
          const name = profile.displayName ||
            (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : 'Google User');
          const avatar = (profile.photos && profile.photos[0] && profile.photos[0].value)
            ? profile.photos[0].value
            : '';

          if (!email) {
            return done(new Error('No email address associated with this Google account'), null);
          }

          // SECURITY: Block admin email from being registered as a normal user
          const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
          if (adminEmail && email.toLowerCase() === adminEmail) {
            return done(new Error('This Google account email is reserved for admin access only. Please use the Admin Login portal.'), null);
          }

          // 1. Check if user already exists with googleId
          let user = await User.findOne({ googleId });
          if (user) {
            if (!user.avatar && avatar) {
              user.avatar = avatar;
              await user.save();
            }
            return done(null, user);
          }

          // 2. Check if user already exists with email (account linking)
          user = await User.findOne({ email });
          if (user) {
            user.googleId = googleId;
            if (!user.avatar && avatar) {
              user.avatar = avatar;
            }
            await user.save();
            return done(null, user);
          }

          // 3. Create new Google user
          user = await User.create({
            name,
            email,
            googleId,
            avatar,
            role: 'user'
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
  console.log('🔑 Google OAuth Strategy registered successfully.');
} else {
  console.warn('⚠️ Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) missing in .env. Google login strategy bypassed.');
}

module.exports = passport;
