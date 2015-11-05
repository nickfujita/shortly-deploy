var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

// var mongoose = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

// prmisifying mongoose functions
// Promise.promisifyAll(User);
// Promise.promisifyAll(Link);

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Promise.resolve(Link.find({}).exec())
  .then(function(links) {
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Promise.resolve(Link.find({url: uri}).exec())
  .then(function(found) {
    if (found[0]) {
      res.send(200, found.attributes);
    } else {
      console.log('about to extract the url title');
      util.getUrlTitle(uri, function(err, title) {
        console.log('error coming back from url title'+ err);
        console.log('title coming back from url title'+ title);
        if(err) {
          console.log('Error reading URL ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: 'uri',
          title: 'title',
          code: 'bbb',
          base_url: 'req.headers.origin'
        });
        console.log('created newLink');
        Promise.resolve(newLink.save())
        .then(function() {
          console.log('newLink saved ok');
          res.send(200, newLink);
        })
        .catch(function(err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        });
      })
    }
  })
  .catch(function(err) {
    console.log('err', err);
    return res.send(404);
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Promise.resolve(User.find({ username: username }).exec())
  .then(function(user) {
    if (!user[0]) {
      res.redirect('/login');
    } else {
      user[0].comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  })
  .catch(function(err) {
    throw err;
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  Promise.resolve(User.find({ username: username }).exec())
  .then(function(user) {
    console.log('made it to the promise then');
    if (!user[0]) {
      var newUser = new User({
        username: username,
        password: password
      });
      Promise.resolve(newUser.save())
      .then(function() {
        util.createSession(req, res, newUser);
      })
      .catch(function(err) {
        throw err;
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  })
  .catch(function(err) {
    throw err;
  });

};

exports.navToLink = function(req, res) {
  Promise.resolve(Link.find({ code: req.params[0] }).exec())
  .then(function(link) {
    if (!link[0]) {
      res.redirect('/');
    } else {
      console.log(link);
      link[0].visits += 1;
      Promise.resolve(link[0].save())
      .then(function() {
        return res.redirect(link.url);
      });
    }
  })
  .catch(function(err) {
    throw err;
  });
};