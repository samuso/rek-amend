var Bourne, Engine, _, app, async, e, express, movies, port;

_ = require('underscore');

async = require('async');

Bourne = require('bourne');

express = require('express');

movies = require('./data/movies.json');

Engine = require('./lib/engine');

e = new Engine;

app = express();

app.set('views', __dirname + "/views");

app.set('view engine', 'jade');

app.route('/refresh').post(function(arg, res, next) {
  var query;
  query = arg.query;
  return async.series([
    (function(_this) {
      return function(done) {
        return e.similars.update(query.user, done);
      };
    })(this), (function(_this) {
      return function(done) {
        return e.suggestions.update(query.user, done);
      };
    })(this)
  ], (function(_this) {
    return function(err) {
      if (err != null) {
        return next(err);
      }
      return res.redirect("/?user=" + query.user);
    };
  })(this));
});

app.route('/like').post(function(arg, res, next) {
  var query;
  query = arg.query;
  if (query.unset === 'yes') {
    return e.likes.remove(query.user, query.movie, (function(_this) {
      return function(err) {
        if (err != null) {
          return next(err);
        }
        return res.redirect("/?user=" + query.user);
      };
    })(this));
  } else {
    return e.dislikes.remove(query.user, query.movie, (function(_this) {
      return function(err) {
        if (err != null) {
          return next(err);
        }
        return e.likes.add(query.user, query.movie, function(err) {
          if (err != null) {
            return next(err);
          }
          return res.redirect("/?user=" + query.user);
        });
      };
    })(this));
  }
});

app.route('/dislike').post(function(arg, res, next) {
  var query;
  query = arg.query;
  if (query.unset === 'yes') {
    return e.dislikes.remove(query.user, query.movie, (function(_this) {
      return function(err) {
        if (err != null) {
          return next(err);
        }
        return res.redirect("/?user=" + query.user);
      };
    })(this));
  } else {
    return e.likes.remove(query.user, query.movie, (function(_this) {
      return function(err) {
        if (err != null) {
          return next(err);
        }
        return e.dislikes.add(query.user, query.movie, function(err) {
          if (err != null) {
            return next(err);
          }
          return res.redirect("/?user=" + query.user);
        });
      };
    })(this));
  }
});

app.route('/').get(function(arg, res, next) {
  var query;
  query = arg.query;
  return async.auto({
    likes: (function(_this) {
      return function(done) {
        return e.likes.itemsByUser(query.user, done);
      };
    })(this),
    dislikes: (function(_this) {
      return function(done) {
        return e.dislikes.itemsByUser(query.user, done);
      };
    })(this),
    suggestions: (function(_this) {
      return function(done) {
        return e.suggestions.forUser(query.user, function(err, suggestions) {
          if (err != null) {
            return done(err);
          }
          return done(null, _.map(_.sortBy(suggestions, function(suggestion) {
            return -suggestion.weight;
          }), function(suggestion) {
            return _.findWhere(movies, {
              id: suggestion.item
            });
          }));
        });
      };
    })(this)
  }, (function(_this) {
    return function(err, arg1) {
      var dislikes, likes, suggestions;
      likes = arg1.likes, dislikes = arg1.dislikes, suggestions = arg1.suggestions;
      if (err != null) {
        return next(err);
      }
      return res.render('index', {
        movies: movies,
        profiles: movies.profiles,
        user: query.user,
        likes: likes,
        dislikes: dislikes,
        suggestions: suggestions.slice(0, 4)
      });
    };
  })(this));
});

app.listen((port = 3000), function(err) {
  if (err != null) {
    throw err;
  }
  return console.log("Listening on " + port);
});
