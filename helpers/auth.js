module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/account/signin');
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/dashboard/');
        } else {
            return next();
        }
    },
    ensureAuthor: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.user_type == "author" || req.user.user_type == 'admin') {
                return next();
            } else {
                req.flash('error_msg', 'You do not have permission to create news ');
                return res.redirect('/')
            }
        } else {
            res.redirect('/account/signin');
        }
    }
}