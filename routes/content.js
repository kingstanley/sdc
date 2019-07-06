const db = require('../configs/keys');
const Sequelize = require('sequelize');
const express = require('express');
const router = express.Router();

const sequelize = new Sequelize('mysql://root:@localhost:3306/lifexchange');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Post = sequelize.define('posts');

router.get('/', (req, res) =>{
    Post.findAll().then(posts =>{
        console.log(posts);
    })
})

