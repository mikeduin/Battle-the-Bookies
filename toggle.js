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
