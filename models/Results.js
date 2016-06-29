var mongoose = require ('mongoose');

var ResultSchema = new mongoose.Schema({
  EventID: {
    type: String,
    required: true,
    unique: true
  },
  HomeScore: Number,
  AwayScore: Number,
  OddType: String,
  Final: Boolean,
  FinalType: String
})

mongoose.model('Result', ResultSchema);
