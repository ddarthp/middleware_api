/**
 * Created by dpineda on 6/30/17.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('Users');

exports.save_user =  (userData) => {
    var UserObj = {
        email:userData.email,
        name:userData.name,
        gender:userData.utmSource,
        Created_date: Date.now,
    }

    var new_user = new User(UserObj);
    new_user.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
}

