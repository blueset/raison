var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema( {
    author: mongoose.Schema.ObjectId,
    investor: mongoose.Schema.ObjectId,
    offers: [mongoose.Schema.ObjectId],
    datePosted: Date,
    progress: [
        {
            isAuthor: Boolean,
            comment: String,
            timeCreated: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    title: String,
    subtitle: String,
    desc: String,
    totalFunds: Number,
    categories: [String],
    location: {
        lat: mongoose.Schema.Types.Decimal128,
        long: mongoose.Schema.Types.Decimal128
    },
    comments: [
        {
            commenter: mongoose.Schema.ObjectId,
            comment: String,
            date: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    ratings: {
        sumRate: Number,
        numVoters: Number
    }
});

mongoose.model('project', projectSchema);