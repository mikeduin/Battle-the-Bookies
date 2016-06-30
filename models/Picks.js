var mongoose = require ('mongoose');

var PickSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  // EventID is capitalized to stay consistent across all Schemas
  EventID: {
    type: String,
    required: true
  },
  activePick: String,
  activeLine: Number,
  activePayout: Number,
  pickType: String
})

mongoose.model('Pick', PickSchema)
