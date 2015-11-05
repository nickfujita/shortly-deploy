var mongoose = require('../config');
var Schema = mongoose.Schema;

var linkSchema = new Schema({
  url: {type: String, required: true, unique: true},
  base_url: {type: String, required: true, unique: true},
  code: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  visits: Number,
  timestamps: Date
})

var Link = mongoose.model('Link', linkSchema);
module.exports = Link;



// var db = require('../config');
// var crypto = require('crypto');

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function(){
//     this.on('creating', function(model, attrs, options){
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

// module.exports = Link;

//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();

