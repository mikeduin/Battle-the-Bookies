var mongoose = require ('mongoose');

var PickSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  // EventID + MatchDay are capitalized to stay consistent across all Schemas/with third-party API
  EventID: {
    type: String,
    required: true
  },
  MatchDay: String,
  MatchTime: Date,
  activePick: String,
  activeSpread: Number,
  activeTotal: Number,
  activeLine: Number,
  activePayout: Number,
  pickType: String,
  pickResult: String,
  resultBinary: Number,
  finalPayout: Number
})

mongoose.model('Pick', PickSchema);
