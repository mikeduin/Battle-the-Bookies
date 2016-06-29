var mongoose = require ('mongoose');

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
  MoneyLineHome: Number,
  MoneyLineAway: Number,
  PointSpreadHome: Number,
  PointSpreadAway: Number,
  PointSpreadAwayLine: Number,
  PointSpreadHomeLine: Number,
  TotalNumber: Number,
  OverLine: Number,
  UnderLine: Number
})

mongoose.model('Line', LineSchema);
