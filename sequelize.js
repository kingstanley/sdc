// const Sequelize = require('sequelize');
// const UserModel = require('./models/User');
// const BlogModel = require('./models/Post');
// const TagModel = require('./models/Tag');
// const key = require('./configs/keys');

// const sequelize = key.mysqlURI;

// const User = UserModel(sequelize, Sequelize);
// const BlogTag = sequelize.define('blog_tag', {});
// const Blog = BlogModel(sequelize, Sequelize);
// const Tag = TagModel(sequelize, Sequelize);

// Blog.belongsToMany(Tag, { through: BlogTag, unique: false });
// Tag.belongsToMany(Blog, { through: BlogTag, unique: false });

// User.sync({
//     firstName: 'Stanley',
//     lastName: 'Nwaegwu',
//     username: 'kingstanley',
//     password: 'Nj12063/',
//     email: 'kingstanley.ks16@gmail.com',
//     user_type: 'admin'
// }).then(user =>{
//     if(user){
//         console.log(user);
//     }
// });
// sequelize.sync({ force: false })
//     .then(() => {
        
//         console.log("Database & tables created!");
//     })
 
// module.exports = {
//     User, Blog, Tag
// };