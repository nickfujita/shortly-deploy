var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('../config');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.pre('save', function(next) {
  this.hashPassword()
  .then(function() {
    next();
  });
});

var User = mongoose.model('User', userSchema);
module.exports = User;



// var db = require('../config');

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   },
// });

