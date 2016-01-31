var Bourne, Rater, _, async;

_ = require('underscore');

async = require('async');

Bourne = require('bourne');

module.exports = Rater = (function() {
  function Rater(engine, kind) {
    this.engine = engine;
    this.kind = kind;
    this.db = new Bourne("./db-" + this.kind + ".json");
  }

  Rater.prototype.add = function(user, item, done) {
    return this.db.find({
      user: user,
      item: item
    }, (function(_this) {
      return function(err, res) {
        if (err != null) {
          return done(err);
        }
        if (res.length > 0) {
          return done();
        }
        return _this.db.insert({
          user: user,
          item: item
        }, function(err) {
          if (err != null) {
            return done(err);
          }
          return async.series([
            function(done) {
              return _this.engine.similars.update(user, done);
            }, function(done) {
              return _this.engine.suggestions.update(user, done);
            }
          ], done);
        });
      };
    })(this));
  };

  Rater.prototype.remove = function(user, item, done) {
    return this.db["delete"]({
      user: user,
      item: item
    }, (function(_this) {
      return function(err) {
        if (err != null) {
          return done(err);
        }
        return async.series([
          function(done) {
            return _this.engine.similars.update(user, done);
          }, function(done) {
            return _this.engine.suggestions.update(user, done);
          }
        ], done);
      };
    })(this));
  };

  Rater.prototype.itemsByUser = function(user, done) {
    return this.db.find({
      user: user
    }, (function(_this) {
      return function(err, ratings) {
        if (err != null) {
          return done(err);
        }
        return done(null, _.pluck(ratings, 'item'));
      };
    })(this));
  };

  Rater.prototype.usersByItem = function(item, done) {
    return this.db.find({
      item: item
    }, (function(_this) {
      return function(err, ratings) {
        if (err != null) {
          return done(err);
        }
        return done(null, _.pluck(ratings, 'user'));
      };
    })(this));
  };

  return Rater;

})();