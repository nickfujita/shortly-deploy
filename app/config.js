var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));

if(process.env.NODE_ENV === 'production') {
  //mongoose.connect('mongodb://MongoLab-l:zeJPQzbSoEPpww0FLheAvTPTffOL5aU1625E5bFeq1g-@ds052408.mongolab.com:52408/MongoLab-l');
  mongoose.connect('mongodb://chatterAdmin:chadmin@ds045664.mongolab.com:45664/chatterbox');
} else {
  mongoose.connect('mongodb://localhost:27017/shrty');
}

module.exports = mongoose;


// var Bookshelf = require('bookshelf');
// var path = require('path');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: process.env.PATH,
//     user: '',
//     password: '',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

