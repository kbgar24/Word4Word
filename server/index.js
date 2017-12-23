const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

const {User} = require('../db');
const DIST_DIR   = path.join(__dirname,  "../dist");
const port = process.env.PORT || 8000;

const app = express();

app.use(express.static(DIST_DIR));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'secret' }))
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new facebookStrategy({
  clientID: '1769031433398507',
  clientSecret: '7e908fd859386bb1c46285810f9245b4',
  callbackURL: 'http://localhost:8000/auth/facebook/callback',
  profileFields: ['first_name', 'last_name', 'picture.type(large)', 'gender', 'emails', 'about', 'education', 'hometown', 'link', 'quotes'],
  enableProof: true
}, (accessToken, refreshToken, profile, done) => {
    console.log('profile from FB: ', profile);
    console.log('accessToken: ', accessToken)
    console.log('refreshToken: ', refreshToken)
    User.findOne({facebookId: profile.id})
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        User.create({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          avatarUrl: profile.photos[0].value,
          facebookId: profile.id
        })
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err, null)
        });
      }
    })
  }
));

app.get('/', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.get('/login', (req, res) => {
  res.end('Please log in');
});

app.get('/privacy', (req, res) => {
  res.status(200).end('lol');
})

app.get('/auth/facebook', passport.authenticate('facebook', {
  authType: 'rerequest',
  scope: ['email', 'public_profile'],
}));

app.get('/auth/facebook/callback',passport.authenticate('facebook', {
  failureRedirect: '/login',
}), (req, res) => { res.redirect('/');});

app.get('*', (req, res) => {
  console.log('unknown req!: ', req.url);
  res.end('Unknown!!')
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
