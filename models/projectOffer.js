var mongoose = require('mongoose');

var projectOfferSchema = new mongoose.Schema( {
    investor: mongoose.Schema.ObjectId,
    project: mongoose.Schema.ObjectId,
    fundOffer: Number,
    accepted: Boolean,
    proposal: String,
    dateOffered: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('projectOffer', projectOfferSchema);