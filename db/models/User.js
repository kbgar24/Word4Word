const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  avatarUrl: String,
  highScores: [],
  facebookId: { type: String, unique: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;







// TODO: Figure out why this won't work:
// UserSchema.statics.findOrCreate = (condition, doc, callback) => {
//   console.log('haha');
//   // const self = new User();
//   console.log('self: ', self);
//   self.findOne(condition)
//   .then((user) => {
//     if (user) {
//       callback(null, user);
//     } else {
//       self.create(doc)
//       .then((user) => { callback(null, user); })
//       .catch((err) => { callback(err, null); })
//     }
//   })
//   .catch((err) => { callback(err, null); });
// };
// UserSchema.statics.findOrCreate = require('find-or-create');

// UserSchema.statics.findOrCreate  = () => { console.log('haha') }
// const User = mongoose.model('User', UserSchema);
// console.log('User: ', )
