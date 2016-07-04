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

// BEGIN ROUTES TO AUTO-UPDATE ODDS + RESULTS FROM API

router.get('/updateResults', function(req, res, next) {
  fetch('https://jsonodds.com/api/results/mlb', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': 'f6e556e5-0092-49d9-9e4f-c7aa591eaecb'
    }
  }).then(function(res){
    return res.json()
  }).then(function(results){

    var bulk = Result.collection.initializeOrderedBulkOp();
    var counter = 0;

    for (i = 0; i < results.length; i++) {
      // Line.find({EventID: results[i].ID}).upsert().updateOne({
      //   $set: {
      //     FinalType: results[i].FinalType,
      //     Final: results[i].Final,
      //     HomeScore: results[i].HomeScore,
      //     AwayScore:results[i].AwayScore
      //   }
      // }, function(err, line){
      //   if(err) {console.log(err)}
      //   console.log(line)
      // });

      bulk.find({EventID: results[i].ID}).upsert().updateOne({
        $set: {
          EventID: results[i].ID,
          HomeScore: results[i].HomeScore,
          AwayScore: results[i].AwayScore,
          OddType: results[i].OddType,
          Final: results[i].Final,
          FinalType: results[i].FinalType
        }
      });
      counter++;

      if (counter % 1000 == 0) {
        bulk.execute(function(err, res){
          bulk = Result.collection.initializeOrderedBulkOp();
        });
      }
    };

    if (counter % 1000 != 0)
        bulk.execute(function(err,res) {
           console.log('results bulk update completed at ' + new Date());
        });
    res.json(odds);

  })
});

router.get('/updateOdds', function(req, res, next) {
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
          MatchTime: new Date(odds[i].MatchTime),
          MatchDay: moment(odds[i].MatchTime).format('MMMM Do, YYYY'),
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

      if (counter % 1000 == 0) {
        bulk.execute(function(err, result){
          bulk = Line.collection.initializeOrderedBulkOp();
        });
      }
    };

    if (counter % 1000 != 0)
        bulk.execute(function(err,result) {
           console.log('odds bulk update completed at ' + new Date());
        });

    res.json(odds);
    }
  )
});

// END ROUTES TO AUTO-UPDATE ODDS + RESULTS FROM API
// BEGIN LINE ROUTES

router.get('/lines', function(req, res, next){
  Line.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.put('/lines/updateStatus', function (req, res, next){
  console.log(req.body)
  Line.update({EventID: req.body[0].EventID},
    {
      GameStatus: "Final",
      HomeScore: req.body[0].HomeScore,
      AwayScore: req.body[0].AwayScore,
    },
    function(err, game){
    console.log("this is what returns from update status "+ game);
    if (err) { console.log(err) };

    console.log('game status updated to final')
  })
})

// END LINE ROUTES
// BEGIN RESULTS ROUTES

router.get('/results', function(req, res, next){
  Result.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.param('EventID', function(req, res, next, EventID) {
  var query = Result.find({ EventID: EventID });

  query.exec(function (err, result) {
    if (err) { next(err) }
    if (!result) {return next(new Error("can't find game")); }

    req.result = result;
    return next();
  })
})

router.get('/results/:EventID', function(req, res) {
    res.json(req.result);
})

// END RESULTS ROUTES
// BEGIN PICK ROUTES

router.put('/updateDollars', function(req, res, next){
  Pick.find(function(err, picks){
    if(err) { console.log(err) }

    picks.forEach(function(doc){
      var finalPayout = (doc.activePayout * doc.resultBinary);
      Pick.update({"_id": doc._id}, {finalPayout: finalPayout}, function(err){
        if(err) {console.log(err)}

        console.log('final payouts updated')
      })
    })

    res.json({message: "payouts updated"})
  })
})

router.get('/picks', function (req, res, next){
  Pick.find(function(err, picks){
    if(err) { next(err) }

    res.json(picks)
  })
})

router.param('pickSubmission', function(req, res, next, pickSubmission) {
  var query = Pick.find({
    EventID: pickSubmission,
    username: "mikeduin"
  });

  query.exec(function (err, result) {
    if (err) { next(err) }
    if (!result) {return next(new Error("no pick for this game")); }

    req.pick = result;
    return next();
  })
})

router.get('/picks/:pickSubmission', function(req, res, next){
  res.json(req.pick);
})

router.put('/picks/awayML', function(req, res, next) {
  console.log(req.body);
  Pick.update({
    EventID: req.body.EventID,
    pickType: "Away Moneyline"
  }, {
      pickResult: req.body.awayMLResult,
      resultBinary: req.body.awayMLBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('away ML picks supposedly updated')
    })
})

router.put('/picks/homeML', function(req, res, next) {
  Pick.update({EventID: req.body.EventID, pickType: "Home Moneyline"}, {
      pickResult: req.body.homeMLResult,
      resultBinary: req.body.homeMLBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('home ML picks supposedly updated')
    })
})

router.put('/picks/awaySpread', function(req, res, next) {
  Pick.update({EventID: req.body.EventID, pickType: "Away Spread"}, {
      pickResult: req.body.awaySpreadResult,
      resultBinary: req.body.awaySpreadBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('away spread picks supposedly updated')
    })
})

router.put('/picks/homeSpread', function(req, res, next) {
  Pick.update({EventID: req.body.EventID, pickType: "Home Spread"}, {
      pickResult: req.body.homeSpreadResult,
      resultBinary: req.body.homeSpreadBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('home spread picks supposedly updated')
    })
})

router.put('/picks/totalOver', function(req, res, next) {
  Pick.update({EventID: req.body.EventID, pickType: "Total Over"}, {
      pickResult: req.body.totalOverResult,
      resultBinary: req.body.totalOverBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('total over picks supposedly updated')
    })
})

router.put('/picks/totalUnder', function(req, res, next) {
  Pick.update({EventID: req.body.EventID, pickType: "Total Under"}, {
      pickResult: req.body.totalUnderResult,
      resultBinary: req.body.totalUnderBinary
    }, {multi: true}, function(err){
      if (err) { console.log(err) };

      console.log('total under picks supposedly updated')
    })
})

// Adding auth as middleware here will ensure that the JWTToken is valid in order for a user to be accessing this route
// !!!TEMPORARILY REMOVED AUTH AS MIDDLEWARE!!!
router.post('/picks', function(req, res, next){

// Note that I've included the username from req.payload, not req.body
  var pick = Pick({
    username: "mikeduin",
    EventID: req.body.activeGame,
    activePick: req.body.activePick,
    activeSpread: req.body.activeSpread,
    activeTotal: req.body.activeTotal,
    activeLine: req.body.activeLine,
    activePayout: req.body.activePayout,
    pickType: req.body.pickType,
    MatchDay: req.body.MatchDay,
    MatchTime: new Date(req.body.MatchTime)
  });

  pick.save(function(err, pick){
    if (err) { next(err) }

    res.json(pick);
    console.log(pick + 'has been added to db!');
  })
})

// BEGIN AUTH ROUTES

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.nameFirst || !req.body.nameLast || !req.body.email || !req.body.buyin
  ){
    return res.status(400).json({message: 'You left something blank!'});
  }

  var user = new User();

  user.username = req.body.username;
  user.nameFirst = req.body.nameFirst;
  user.nameLast = req.body.nameLast;
  user.email = req.body.email;
  user.buyin = req.body.buyin;
  user.setPassword(req.body.password);

  console.log(user);

  user.save(function (err){
    if(err){ return next(err); }

    console.log(user + 'has been added to db!');
    res.json({token: user.generateJWT()})
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

// END AUTH ROUTES

module.exports = router;
