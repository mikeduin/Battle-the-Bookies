var mongoose = require ('mongoose');

// Keys in LineSchema are capitalized to be consistent with key names pulled from third-party API

var LineSchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  HomeTeam: {
    type: String,
    required: true
  },
  AwayTeam: {
    type: String,
    required: true
  },
  MatchTime: {
    type: Date,
    required: true
  },
  MatchDay: String,
  Week: String,
  HomeAbbrev: String,
  AwayAbbrev: String,
  MoneyLineHome: Number,
  MoneyLineAway: Number,
  PointSpreadHome: Number,
  PointSpreadAway: Number,
  PointSpreadAwayLine: Number,
  PointSpreadHomeLine: Number,
  TotalNumber: Number,
  OverLine: Number,
  UnderLine: Number,
  GameStatus: String,
  HomeScore: Number,
  AwayScore: Number
})

mongoose.model('Line', LineSchema);
