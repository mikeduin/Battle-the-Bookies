module.exports = {
  weekSetter: function (MatchTime) {
    if (moment(MatchTime).isBetween('2016-06-23', '2016-07-01')) {
      return "Week 1"
    } else if (moment(MatchTime).isBetween('2016-06-30', '2016-07-08')) {
      return "Week 2"
    } else if (moment(MatchTime).isBetween('2016-07-07', '2016-07-15')) {
      return "Week 3"
    } else if (moment(MatchTime).isBetween('2016-07-14', '2016-07-22')) {
      return "Week 4"
    } else {
      return "Week 5"
    }
  }
}
