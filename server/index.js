const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');

const { User, Room } = require('../db');
const DIST_DIR   = path.join(__dirname,  "../dist");
const port = process.env.PORT || 8000;

const app = express();

app.use(express.static(DIST_DIR));
app.use(morgan('dev'));
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

/*--------- GET Handlers ----------*/

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

app.get('/api/rooms', (req, res) => {
  Room.find({})
  .then((rooms) => {
    const formattedRooms = rooms.map(room => ({
      name: room.name,
      users: 0
    }));
    res.send(formattedRooms).status(200).end('Successfully retrieved rooms');
  })
  .catch((e) => {
    console.error(e)
    res.status(500).end('Unable to retrieve rooms');
  });
});

app.get('*', (req, res) => {
  console.log('unknown req!: ', req.url);
  res.end('Unknown!!')
});

/*--------- POST Handlers ----------*/
app.post('/api/rooms', (req, res) => {
  const {name} = req.body;
  Room.create({name})
  .then(() => {
    console.log(`New room added to database!: ${name}`)
    res.status(201).end();
  })
  .catch((e) => {
    console.error(e)
    res.status(500).end()
  });
})




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
