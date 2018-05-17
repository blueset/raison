var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema( {
    slug: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    investor: mongoose.Schema.Types.ObjectId,
    offers: [mongoose.Schema.Types.ObjectId],
    datePosted: { type: Date, required: true, default: new Date() },
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
    title: { type: String, required: true },
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