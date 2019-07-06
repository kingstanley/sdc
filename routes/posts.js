const express = require("express");
const Sequelize = require("sequelize");
const router = express();
const mongoose = require("mongoose");
const {
  ensureAuthenticated,
  ensureAuthor,
  ensureGuest
} = require("../helpers/auth");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const Post = mongoose.model("posts");
const User = mongoose.model("users");

router.get("/create", ensureAuthor, (req, res) => {
  res.render("posts/create");
});

router.post("/create", (req, res) => {
  let errors = [];

  if (req.body.title == null) {
    errors.push({ text: "Ttitle can't be empty" });
  }
  if (errors.length > 0) {
    res.render("posts/create", {
      errors: errors,
      title: req.body.title,
      hashtags: req.body.hashtags,
      body: req.body.body,
      status: req.body.status
    });
  } else {
    // Upload the post image
    let upload_time = Date.now();
    let image = req.files.image;
    image_url = null;
    const url = req.protocol + "://" + req.get("host");
    image_url = image.mv(`public/posters/${upload_time}_${image.name}`, err => {
      if (err) {
        return res.status(500).send(err);
      } else {
        let allowComments;
        if (req.body.allowComments) {
          allowComment = true;
        } else {
          allowComments = false;
        }
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body,
          status: req.body.status,
          image: `${url}/posters/${upload_time}_${image.name}`,
          allowComments: allowComments,
          user: req.user.id,
          hashTags: req.body.hashtags.split(",")
        });
        newPost
          .save()
          .then(post => {
            if (post) {
              res.redirect(`/view/${post.id}`);
            }
          })
          .catch(err => console.log(err));
      }
    });
  }
});

router.get("/view/:id", (req, res) => {
  // find post with the specified id
  Post.findById(req.params.id)
    .populate("user")
    .populate("comments.commentUser")
    .then(post => {
      if (post) {
        post.views = post.views + 1;
        post.save().then(post => {
          if (post) {
            // console.log('Post; ', post)
            res.render("posts/view", {
              post: post
            });
          }
        });
      } else {
        res.status(404).send("No post with the specified id");
      }
    })
    .catch(err => console.log(err));
});

router.get("/posts/tag/:id", (req, res) => {
  const tag = req.params.id;
  if (tag) {
    console.log(tag);
    Post.find({ "hashTags.Tag": tag })
      .sort({ date: "desc" })
      .populate("user")
      .then(posts => {
        res.render("posts/list", {
          posts: posts
        });
      })
      .catch(err => console.log(err));
  }
});

router.get("/popular", (req, res) => {
  Post.find()
    .sort({ views: "desc" })
    .populate("user")
    .limit(10)
    .then(posts => {
      if (posts) {
        res.render("posts/list", {
          posts: posts
        });
      }
    });
});

router.get("/", (req, res) => {
  User.findOne({
    user_type: "admin"
  }).then(user => {
    if (user) {
      Post.find()
        .sort({ date: "desc" })
        .populate("user")
        .then(posts => {
          if (posts) {
            res.render("posts/list", {
              posts: posts
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      var password = "Nj12063/";
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          const newUser = new User({
            username: "kingstanley",
            email: "kingstanley.ks16@gmail.com",
            firstName: "Stanley",
            lastName: "Nwaegwu",
            password: hash,
            username: "kingstanley",
            status: "active",
            about: "The admin of the site",
            user_type: "admin"
          });
          newUser.save().then(user => {
            res.render("posts/list");
          });
        });
      });
    }
  });
});

router.get("/dashboard/:page?", ensureAuthor, (req, res) => {
  var pageSize = 8;
  var page = req.params.page || 1;

  Post.find({ user: req.user.id })
    .sort({ date: "desc" })
    .skip(pageSize * page - pageSize)
    .limit(pageSize)
    .exec((err, posts) => {
      Post.find({ user: req.user.id })
        .countDocuments()
        .exec((err, count) => {
          if (err) return next(err);
          res.render("index/dashboard", {
            posts: posts,
            page: page,
            pageCount: Math.ceil(count / pageSize),
            limit: pageSize,
            count: count
          });
        });
    });
});
router.get("/welcome", (req, res) => {
  res.render("index/welcome");
});

router.post("/coment/:id", (req, res) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      var coment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      };

      // Save comment
      post.comments.unshift(coment);
      post.save().then(post => {
        if (post) {
          req.flash("success_msg", "Coment saved successfully!");
          res.redirect(`/view/${post.id}`);
        }
      });
    }
  });
});

// Get posts by an author
router.get("/posts/author/:id", (req, res) => {
  Post.find({ user: req.params.id })
    .then(posts => {
      if (posts) {
        res.render("posts/list", {
          posts: posts
        });
      }
    })
    .catch(err => console.log(err));
});

// Get the posts of the logged in user
router.get("/my", ensureAuthor, (req, res) => {
  Post.find({ user: req.user.id })
    .then(posts => {
      if (posts) {
        res.render("posts/list", {
          posts: posts
        });
      }
    })
    .catch(err => console.log(err));
});

// The edit route
router.get("/edit/:id", ensureAuthor, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.user != req.user.id) {
        res.redirect("/");
      } else {
        res.render("posts/edit", {
          post: post
        });
      }
    })
    .catch(err => console.log(err));
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post) {
        let errors = [];
        let image = req.files.image;
        // Check for comments
        let allowComments;
        if (allowComments) {
          allowComments = true;
        } else {
          allowComments = false;
        }
        // Check whether attributes are empty
        if (req.body.title == null) {
          errors.push({ text: "Title can't be empty" });
        }
        if (req.body.body == null) {
          errors.push({ text: "Post body can't be empty" });
        }
        if (errors.length > 0) {
          res.render("posts/edit", {
            errors: errors,
            title: req.title,
            body: req.body.body,
            status: status,
            allowComments: allowComments,
            image: image,
            username: req.body.username
          });
        }
        // Delete the image of the post from the server
        let image_url = "/" + post.image;
        if (post.image) {
          fs.unlink(image_url, err => {
            if (err) {
              console.log(err);
            } else {
              console.log("Image deleted");
            }
          });
        }
        //Assign new values to the post and save

        let upload_time = Date.now();

        var new_image_url = `${url}/posters/${upload_time}_${image.name}`;
        image.mv(new_image_url, err => {
          if (err) {
            console.log(err);
          }
        });
        const url = req.protocol + "://" + req.get("host");

        post.title = req.body.title;
        post.body = req.body.body;
        post.allowComments = allowComments;
        post.status = req.body.status;
        post.hashTags = req.body.hashtags.split(",");
        (post.image = `${url}/posters/${upload_time}_${image.name}`),
          (post.views = post.views - 1);

        post.save().then(post => {
          if (post) {
            req.flash("success_msg", "Updated successfully!");
            res.redirect(`/view/${post.id}`);
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// delete a post
router.delete("/delete/:id", ensureAuthor, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post) {
        let image_url = post.image;
        fs.unlink(image_url, err => {
          if (err) {
            console.log(err);
          } else {
            Post.deleteOne({ _id: req.params.id }).then(() => {
              req.flash(
                "success_msg",
                "Your post has been deleted successfully!"
              );
              res.redirect("/");
            });
          }
        });
      }
    })
    .catch(err => console.log(err));
});

// route/like/id
router.get("/like/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    if (post) {
      post.views = post.views - 1;
      Post.findOne({ _id: req.params.id, "likes.user": req.user.id })
        .then(post => {
          if (post) {
            req.flash("error_msg", "You have already liked this post");
            post.views = post.views - 1;
            post
              .save()
              .then(post => {
                if (post) {
                  res.redirect(`/view/${post.id}`);
                }
              })
              .catch(err => console.log(err));
          } else {
            var likes = {
              user: req.user.id
            };
            Post.findOne({ _id: req.params.id }).then(post => {
              post.likes.unshift(likes);
              //post.views = post.views - 1;
              post
                .save()
                .then(post => {
                  if (post) {
                    res.redirect(`/view/${post.id}`);
                  }
                })
                .catch(err => console.log(err));
            });
          }
        })
        .catch(err => console.log(err));
    }
  });
});
module.exports = router;
