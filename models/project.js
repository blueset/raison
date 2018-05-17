var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema( {
    author: mongoose.Schema.Types.ObjectId,
    investor: mongoose.Schema.Types.ObjectId,
    offers: [mongoose.Schema.Types.ObjectId],
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
    banner: String,
    desc: String,
    totalFunds: Number,
    categories: [String],
    location: String,
    comments: [
        {
            commenter: mongoose.Schema.Types.ObjectId,
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