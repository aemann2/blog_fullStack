const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const content = require('./exports/content');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env'});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set('view engine', 'ejs');
app.use(express.static('public'));

connectDB();

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model('Post', blogSchema);

app.get('/', (req, res) => {
  Post.find({}, (err, items) => {
    res.render('home', {
      startingContent: content.homeStartingContent,
      posts: items,
    });
  })
});

app.get('/post/:id', (req, res) => {
  const post = Post.findById(req.params.id, (err, post) => {
    if (post) {
      res.render('post', { title: post.title, content: post.content });
    } else {
      res.render('sorry');
    }
  });
});

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: content.aboutContent });
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: content.contactContent });
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', (req, res) => {
  Post.create({
    title: req.body.postTitle,
    content: req.body.postContent
  })

  // redirect to the home page for the response
  res.redirect('/');
});

// This line is very immportant for Heroku! We want to be listening on this port rather than on a hard-coded port. Heroku actually passes its own port variable to this env.
let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log('Server started successfully');
});
