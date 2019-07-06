const express = require('express');
const router = express();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureAuthor, ensureGuest } = require('../helpers/auth');
const fs = require('fs');

const Post = mongoose.model('posts');
const User = mongoose.model('users');


router.get('/', (req, res) => {
    Post.find({})
    .then(posts =>{
        if(posts){
            res.status(201).send({
                message: `Total Posts found: ${Post.count()}`,
                posts: posts
            })
        }
    }).catch(error => res.status(400).send(error));
});

router.get('/:id', (req, res) => {
    Post.findOne({_id: req.body.id})
    .then(post =>{
        if(post){
            res.status(201).send({
                message: 'Post was found',
                post: post 
            })
        }
    }).catch(error => {
        res.status(400).send(error)
    });
})


module.exports = router;