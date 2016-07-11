router.get('/updateDailys', function (req, res, next){
  var dateNumbArray = [];
  var userArray = [];
  Pick.find().distinct('DateNumb',function(err, datenumbs){
    if (err) {console.log(err)}

    dateNumbArray = datenumbs;
    sortedDateNumbs = dateNumbArray.sort();
    // console.log(sortedDateNumbs);
  }).then(function(){
    User.find(function(err, users){
      if (err) {console.log(err)}

    }).then(function(users){
        users.forEach(function(user){
          var username = user.username;
          for (i=0; i<sortedDateNumbs.length; i++){

            Pick.find({username: username, DateNumb: sortedDateNumbs[i]}, function(err, results){
              if (err) {console.log(err)}

              // these results logged below are ALL of a users picks for a day
              // console.log('a top-level result is: ' + results)
            }).then(function(results){
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
                    totalDollars += result.finalPayout;
                    totalGames += 1;
                    totalWins += result.resultBinary;
                    totalLosses += (1-result.resulBinary);

                  }
              })

              console.log('total dollars for ' + username + ' on ' + dateNumb + ' is ' + totalDollars + ' from ' + totalWins + ' wins out of ' + totalGames + ' games.');

              userArray.push({username: username, dateNumb: dateNumb, totalDollars: totalDollars, totalWins: totalWins, totalLosses: totalLosses, totalGames: totalGames})

              var query = {
                username: username,
              }

              query['results.'+dateNumb]=dateNumb;

              var queryTwo = {
              };

              queryTwo['results.'+dateNumb+'.dateNumb']=dateNumb;
              queryTwo['results.'+dateNumb+'.totalDollars']=totalDollars;
              queryTwo['results.'+dateNumb+'.totalGames']=totalGames;
              queryTwo['results.'+dateNumb+'.totalWins']=totalWins

              User.findOneAndUpdate(query, {$set: queryTwo
              }, {upsert: true}, function(err, result){
                if (err) {console.log(err)}

                console.log('user result should be updated: ' + result)
              })
            })
            // .then(function(){
            //   console.log(userArray)
            //   res.json(userArray)
            // })
          }
      })
    })
  })
})





.then(function(result){
  Pick.find({EventID: result.EventID}, function(err, pick){
    if (err) {console.log(err)}
    var activePayout = pick.activePayout;

    if (pick.Final === true) {
      if ((pick.pickType === "Away Moneyline") {
        if (pick.AwayScore > pick.HomeScore) {
          Pick.update({"_id": pick._id}, {
            pickResult: "win",
            resultBinary: 1,
            finalPayout: activePayout,
          })
        } else {
          Pick.update({"_id": pick._id}, {
            pickResult: "loss",
            resultBinary: 0,
            finalPayout: -100,
          })
        }
      } else if (pick.pickType === "Home Moneyline") {
        if (pick.HomeScore > pick.AwayScore) {
          Pick.update({"_id": pick._id}, {
            pickResult: "win",
            resultBinary: 1,
            finalPayout: activePayout,
          })
        } else {
          Pick.update({"_id": pick._id}, {
            pickResult: "loss",
            resultBinary: 0,
            finalPayout: -100,
          })
        }
      }
    }

    console.log("these are the second promise's picks: " + pick)
  })
})
})
