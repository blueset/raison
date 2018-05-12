var mongoose = require('mongoose');

var userSchema = new mongoose.Schema( {
    authentication: {
        username: String,
        email: String,
        password: String
    },
    name: String,
    bio: String,
    role: String,
    image: String,
    totalFunds: Number,
    // Project Id
    projects: [mongoose.Schema.ObjectId],
    notifications: [
        {
            content: String,
            link: String,
            read: Boolean,
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    activity: [
        {
            content: String,
            link: String,
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    oAuth: {
        facebook: {
            accessToken: String,
            refreshToken: String,
            profile: mongoose.Schema.Types.Mixed,
        },
        twitter: {
            token: String,
            tokenSecret: String,
            profile: mongoose.Schema.Types.Mixed,
        },
        google: {
            accessToken: String,
            refreshToken: String,
            profile: mongoose.Schema.Types.Mixed,
        },
        github: {
            accessToken: String,
            refreshToken: String,
            profile: mongoose.Schema.Types.Mixed,
        },
        telegram: {
            profile: mongoose.Schema.Types.Mixed,
        },
    }
});

mongoose.model('users', userSchema);