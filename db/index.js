// const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/word4word', {
  useMongoClient: true
});

db.on('error', console.error.bind(console, 'connection error!:'));
db.once('open', () => { console.log('db connected!') });

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  avatarUrl: String,
  highScores: [],
  facebookId: { type: String, unique: true }
});

const User = mongoose.model('User', userSchema);

// exports.save = (user) => {
//   return new Promise((resolve, reject) => {
//     const newUser = new User({
//       firstName: user.firstName,
//       lastName: user.lastName,
//       avatarUrl: user.url,
//       facebookId: user.id
//     });
//     newUser.save()
//     .catch((e) => console.error(e));
//   })
// }
