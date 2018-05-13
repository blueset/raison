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
            project: mongoose.Schema.ObjectId,
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