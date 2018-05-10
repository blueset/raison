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
    // Project Id
    projects: [mongoose.Schema.ObjectId],
    notification: [
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
    ]
});

mongoose.model('users', userSchema);