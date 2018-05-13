var mongoose = require('mongoose');

var projectOfferSchema = new mongoose.Schema( {
    actor: mongoose.Schema.ObjectId,
    project: mongoose.Schema.ObjectId,
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