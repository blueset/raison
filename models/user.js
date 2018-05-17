var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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
    offers: [
        {
            project: mongoose.Schema.Types.ObjectId,
            offer: mongoose.Schema.Types.ObjectId
        }
    ],
    projects: [mongoose.Schema.Types.ObjectId],
    notifications: [
        {
            content: String,
            project: mongoose.Schema.Types.ObjectId,
            link: String,
            from: {
                email: String,
                name: String
            },
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
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

mongoose.model('users', userSchema);