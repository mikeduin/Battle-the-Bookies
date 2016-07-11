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

// BEGIN ROUTES TO AUTO-UPDATE ODDS + RESULTS (FROM API) AND USER PICKS (FROM DB)

// This first function updates game results.

setInterval(function(){
  fetch('https://jsonodds.com/api/results/mlb', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': '26f594b0-3f1f-42ae-b2c9-c1607625a905'
    }
  }).then(function(res){
    return res.json()
  }).then(function(results){

    var bulk = Result.collection.initializeOrderedBulkOp();
    var counter = 0;

    for (i = 0; i < results.length; i++) {
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
    // res.json(odds);
  })
}, 30000)


// The next function below looks for picks that have a finalPayout of ZERO (e.g., they have not been 'settled' yet) then checks to see if the Result of that pick's game is final. If the result IS final, it updates the picks with the HomeScore and AwayScore and sets 'Final' to true for that pick. THEN, it runs through each potential outcome based on PickType and updates the result variables accordingly.

setInterval(function(){
  Pick.find({finalPayout: 0}, function (err, picks){
    if (err) {console.log(err)}

  }).then(function(picks){
    picks.forEach(function(pick){
      var HomeScore;
      var AwayScore;
      Result.findOne({EventID: pick.EventID}, function (err, result){
        if (err) {next(err)}

        if(result.Final === true) {
          var HomeScore = result.HomeScore;
          var AwayScore = result.AwayScore;

          Pick.update({"_id": pick._id}, {
            HomeScore: HomeScore,
            AwayScore: AwayScore,
            Final: true
          }, function (err, pick) {
            if (err) {console.log(err)}

          })
        }
      }).then(function(result){
        Pick.find({EventID: result.EventID}, function(err, picks){
          if (err) {console.log(err)}

        }).then(function(picks){
          picks.forEach(function(pick){
            var activePayout = pick.activePayout;

            if (pick.Final === true) {

              if (
                ((pick.pickType === "Away Moneyline") && (pick.AwayScore > pick.HomeScore))
                ||
                ((pick.pickType === "Home Moneyline") && (pick.HomeScore > pick.AwayScore))
                ||
                ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) > pick.HomeScore))
                ||
                ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) > pick.AwayScore))
                ||
                ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) > pick.activeTotal))
                ||
                ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) < pick.activeTotal))
              ) {
                  Pick.update({"_id": pick._id}, {
                    pickResult: "win",
                    resultBinary: 1,
                    finalPayout: activePayout,
                  }, function(err, result){
                    if (err) {console.log(err)}
                  })
                } else if (
                  ((pick.pickType === "Away Moneyline") && (pick.AwayScore === pick.HomeScore))
                  ||
                  ((pick.pickType === "Home Moneyline") && (pick.HomeScore === pick.AwayScore))
                  ||
                  ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) === pick.HomeScore))
                  ||
                  ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) === pick.AwayScore))
                  ||
                  ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                  ||
                  ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                ) {
                    Pick.update({"_id": pick._id}, {
                      pickResult: "push",
                      resultBinary: 0.5,
                      finalPayout: 0.00001,
                    }, function(err, result){
                      if (err) {console.log(err)}
                    })
                  }
                 else
                {
                  Pick.update({"_id": pick._id}, {
                    pickResult: "loss",
                    resultBinary: 0,
                    finalPayout: -100,
                  }, function(err, result){
                    if (err) {console.log(err)}
                  })
                }
              }
            })
          })
        })
      })
    })
  console.log('picks updated at ' + new Date())
}, 30000)

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.

router.get('/updateOdds', function(req, res, next) {
  fetch('https://jsonodds.com/api/odds/mlb', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': '26f594b0-3f1f-42ae-b2c9-c1607625a905'
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
          DateNumb: parseInt(moment(odds[i].MatchTime).format('YYYYMMDD')),
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

// The function below checks un-settled picks to see if its related game has completed. If so, it updates the finalPayout variable for that pick.

setInterval(function(){Pick.find(function(err, picks){
  if(err) { console.log(err) }

  picks.forEach(function(doc){
    var finalPayout;
    if (doc.pickResult === "win") {
      finalPayout = doc.activePayout
    } else if (doc.pickResult === "loss") {
      finalPayout = -100
    } else {
      finalPayout = 0
    }

    Pick.update({"_id": doc._id}, {finalPayout: finalPayout}, function(err){
      if(err) {console.log(err)}

    })
  })

  console.log('pick payouts updated at ' + new Date())
})}, 30000)

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

router.get('/picks', function (req, res, next){
  Pick.find(function(err, picks){
    if(err) { next(err) }

    res.json(picks)
  })
})

router.get('/picks/checkSubmission/:EventID', auth, function(req, res, next){
  Pick.find({
    username: req.payload.username,
    EventID: req.params.EventID
  }, function(err, pick){
    if (err) {console.log(err)}

    res.json(pick)
  })
})

router.get('/picks/:username/all', function (req, res, next) {
  Pick.find({
    username: req.params.username
  }, function(err, result){
    if(err) {console.log(err)}

    res.json(result)
  })
})

router.get('/dailyStats/:username', function(req, res, next){
  var username = req.params.username;
  var dateNumbArray = [];
  Pick.find().distinct('DateNumb',function(err, datenumbs){
    if (err) {console.log(err)}

    dateNumbArray = datenumbs;
    sortedDateNumbs = dateNumbArray.sort();
    return sortedDateNumbs
  }).then(function(sortedDateNumbs){

    Promise.all(sortedDateNumbs.sort().map(function(date){
      return Pick.find({username: username, DateNumb: date}).then(function(results){
        // console.log(results)

        var totalDollars = 0;
        var totalGames = 0;
        var totalWins = 0;
        var totalLosses = 0;
        var dateNumb;
        var username;

        results.forEach(function(result){
          // these results logged below are divided into EACH PICK
          // console.log('a pick-level result is: ' + result)
            if (result.finalPayout !== 0) {
              username = result.username;
              dateNumb = result.DateNumb;
              MatchDay = result.MatchDay;
              totalDollars += result.finalPayout;
              totalGames += 1;
              totalWins += result.resultBinary;
              totalLosses += (1-result.resultBinary);
            }
        })

        return {username: username, dateNumb: dateNumb, MatchDay: MatchDay, totalDollars: totalDollars, totalWins: totalWins, totalLosses: totalLosses, totalGames: totalGames}
      })

    })).then(function(userArray){
      res.json(userArray)
    })
  })
})

router.get('/picks/:username/stats', function (req, res, next){
  Pick.find({
    username: req.params.username
  }, function(err, picks){
    if (err) {console.log(err)}

    var awaySpreadPicks = 0;
    var homeSpreadPicks = 0;
    var awayMlPicks = 0;
    var homeMlPicks = 0;
    var totalOverPicks = 0;
    var totalUnderPicks = 0;
    var favPicks = 0;
    var dogPicks = 0;

    for (i=0; i<picks.length; i++) {
      if (picks[i].pickType === "Away Moneyline"){
        awayMlPicks += 1;
      } else if (picks[i].pickType === "Home Moneyline"){
        homeMlPicks += 1;
      } else if (picks[i].pickType === "Away Spread"){
        awaySpreadPicks += 1;
      } else if (picks[i].pickType === "Home Spread"){
        homeSpreadPicks += 1;
      } else if (picks[i].pickType === "Total Over"){
        totalOverPicks += 1;
      } else if (picks[i].pickType === "Total Under"){
        totalUnderPicks += 1;
      } else {
        null
      };

      if (picks[i].favType === "Favorite") {
        favPicks += 1
      } else if (picks[i].favType === "Underdog") {
        dogPicks += 1
      } else {
        null
      };
    }

    res.json({
      awayMlPicks: awayMlPicks,
      homeMlPicks: homeMlPicks,
      awaySpreadPicks: awaySpreadPicks,
      homeSpreadPicks: homeSpreadPicks,
      totalOverPicks: totalOverPicks,
      totalUnderPicks: totalUnderPicks,
      favPicks: favPicks,
      dogPicks: dogPicks
    })
  })
})

router.get('/picks/:username/:datenumb', function (req, res, next) {
  console.log(req.params.datenumb);
  Pick.find({
    username: req.params.username,
    DateNumb: req.params.datenumb
  }, function(err, result){
    if(err) {console.log(err)}

    res.json(result)
  })
})

// Adding auth as middleware here will ensure that the JWTToken is valid in order for a user to be accessing this route
router.post('/picks/addTemp', auth, function (req, res, next){
  var pick = Pick({
    username: req.payload.username,
    EventID: req.body.EventID,
    MatchDay: req.body.MatchDay,
    MatchTime: req.body.MatchTime,
    DateNumb: req.body.DateNumb,
    finalPayout: 0
  });

  pick.save(function(err, pick){
    if (err) {console.log(err)}

    res.json(pick);
    console.log(pick + 'has been saved as a template!')
  })
})

router.put('/picks', auth, function(req, res, next){
  console.log(req.body);
  var activeSpread;
  var activeTotal;
  if (req.body.activeSpread) {
    activeSpread = req.body.activeSpread
  } else {
    activeSpread = 0;
  };
  if (req.body.activeTotal) {
    activeTotal = req.body.activeTotal
  } else {
    activeTotal = 0;
  };

  Pick.update({
    EventID: req.body.activeGame,
    username: req.payload.username,
  }, {
    activePick: req.body.activePick,
    activeSpread: activeSpread,
    activeTotal: activeTotal,
    activeLine: req.body.activeLine,
    activePayout: req.body.activePayout,
    pickType: req.body.pickType,
    favType: req.body.favType,
    submittedAt: new Date()
  }, function(err, pick) {
    if (err) {console.log(err)}

    console.log(pick + ' has been updated with pick submission info!');
    res.json(pick);
  })
})

// END PICK ROUTES
// BEGIN USER ROUTES

router.get('/users', function (req, res, next){
  User.find(function(err, users){
    if (err) {console.log(err)}

    res.json(users)
  })
})

router.get('/users/:username', function (req, res, next){
  User.find({
    username: req.params.username
  }, function(err, user){
    if (err) {console.log(err)}

    res.json(user)
  })
})

// END USER ROUTES
// BEGIN AUTH ROUTES

router.post('/register', function(req, res, next){
  console.log(req.body);
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
    if(err){ console.log(err); }

    console.log(user + 'has been added to db!');
    res.json({token: user.generateJWT()})
  });

});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  }

  console.log(req.body);

  passport.authenticate('local', function(err, user, info){
    console.log(user);
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
