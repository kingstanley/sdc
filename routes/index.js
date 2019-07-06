const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { ensureAuthenticated, ensureGuest, ensureAuthor } = require('../helpers/auth');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Post = mongoose.model('posts');

router.get('/', ensureGuest, (req, res) => {


    User.findOne({
        user_type: 'admin'
    }
    ).then(user => {
        if (user) {
            res.render('index/welcome');
        } else {
            var password = '123456';
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err
                    const newUser = new User({
                        username: 'kingstanley',
                        email: 'kingstanley.ks16@gmail.com',
                        firstName: 'Stanley',
                        lastName: 'Nwaegwu',
                        password: hash,
                        username: 'kingstanley',
                        status: 'active',
                        about: 'The admin of the site',
                        user_type: 'admin'
                    })
                    newUser.save().then(user => {
                        res.render('index/welcome');
                    });
                })
            })

        }
    })
});

router.get('/dashboard/:page?', ensureAuthor, (req, res) => {
    var pageSize = 8;
    var page = req.params.page || 1;
 
    Post.find({ user: req.user.id }).sort({ date: 'desc' })
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .exec((err, posts) => {
            Post.find({user: req.user.id}).countDocuments().exec((err, count) => {
                if (err) return next(err);
                res.render('index/dashboard', {
                    posts: posts,
                        page: page,
                        pageCount: Math.ceil(count / pageSize),
                        limit: pageSize,
                        count: count
                }); 
            });
        })

});
router.get('/welcome', (req, res) => {
    res.render('index/welcome');
});

router.get('/scrolfire', (req, res) =>{
    
    
})


module.exports = router;