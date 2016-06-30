var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'})
var fetch = require('node-fetch');
var moment = require ('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Line = mongoose.model('Line');
var Result = mongoose.model('Result');
var Pick = mongoose.model('Pick');
var abbrevs = require('../modules/abbrevs.js');
var setWeek = require('../modules/weekSetter.js')

router.get('/updateDb', function(req, res, next) {
  fetch('https://jsonodds.com/api/odds/mlb', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': 'f6e556e5-0092-49d9-9e4f-c7aa591eaecb'
    }
  }).then(function(res){
    return res.json()
  }).then(function(odds){

    var bulk = Line.collection.initializeOrderedBulkOp();
    var counter = 0;

    for (i = 0; i < odds.length; i++) {
      bulk.find({EventID: odds[i].ID}).upsert().updateOne({
        $set : {
          EventID: odds[i].ID,
          HomeTeam: odds[i].HomeTeam,
          AwayTeam: odds[i].AwayTeam,
          HomeAbbrev: abbrevs.teamAbbrev(odds[i].HomeTeam),
          AwayAbbrev: abbrevs.teamAbbrev(odds[i].AwayTeam),
          MatchTime: odds[i].MatchTime,
          Week: setWeek.weekSetter(odds[i].MatchTime),
          MoneyLineHome: odds[i].Odds[0].MoneyLineHome,
          MoneyLineAway: odds[i].Odds[0].MoneyLineAway,
          PointSpreadHome: odds[i].Odds[0].PointSpreadHome,
          PointSpreadAway: odds[i].Odds[0].PointSpreadAway,
          PointSpreadAwayLine: odds[i].Odds[0].PointSpreadAwayLine,
          PointSpreadHomeLine: odds[i].Odds[0].PointSpreadHomeLine,
          TotalNumber: odds[i].Odds[0].TotalNumber,
          OverLine: odds[i].Odds[0].OverLine,
          UnderLine: odds[i].Odds[0].UnderLine
        }
      });
      counter++;

      if ( counter % 1000 == 0) {
        bulk.execute(function(err, result){
          bulk = Line.collection.initializeOrderedBulkOp();
        });
      }

    };

    if ( counter % 1000 != 0 )
        bulk.execute(function(err,result) {
           console.log(result);
        });

    res.json(odds);
    }
  )
})

router.get('/api', function(req, res, next){
  Line.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.get('/api/today', function(req, res, next){
  var start = moment().startOf('day');
  var end = moment(start).add(1, 'days');
  Line.find({
    Week: "Week 1"},

    // MatchTime: {
    //   $gte: start.toDate(),
    //   $lt: end.toDate()
    // }},

  function(err, games) {
    console.log(games);
    if (err) { next(err) };

    res.json(games);
    console.log('db query completed');
  })
})

router.post('/picks', function(req, res, next){
  var pick = Pick({
    username: req.body.username,
    EventID: req.body.EventID,
    activePick: req.body.activePick,
    activeLine: req.body.activeLine,
    activePayout: req.body.activePayout,
    pickType: req.body.pickType
  });

  pick.save(function(err, pick){
    if (err) { return next(err) }

    res.json(pick);
    console.log(pick + 'has been added to db!');
  })
})

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.nameFirst || !req.body.nameLast || !req.body.email || !req.body.buyin){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
