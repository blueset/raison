var mongoose = require('mongoose');

var projectOfferSchema = new mongoose.Schema( {
    actor: mongoose.Schema.Types.ObjectId,
    project: mongoose.Schema.Types.ObjectId,
    type: String,
    fundOffer: Number,
    accepted: Number,
    proposal: String,
    dateOffered: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('projectOffer', projectOfferSchema);