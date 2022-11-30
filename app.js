const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')    
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if(!err){
                res.send(foundArticles);
            }else {res.send(err);}
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if(!err)res.send("success");
            else res.send(err);
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if(!err)res.send("success");
            else res.send(err);
        });
    });


app.route('/articles/:specific')
    .get((req, res) => {
        Article.findOne({title: req.params.specific}, (err, foundArticle) => {
            if(!err)if(foundArticle)res.send(foundArticle);
                else res.send("No article was found");
        });
    })
    .put((req,res) => {
        Article.findOneAndUpdate({title: req.params.specific}, {
            title: req.body.title,
            content: req.body.content
        },{overwrite:true},(err) => {
            if(!err)res.send("success");
            else res.send(err);
        });
    })
    .patch((req, res) => {
        Article.findOneAndUpdate({title: req.params.specific}, {
            title: req.body.title,
            content: req.body.content
        },(err) => {
            if(!err)res.send("success");
            else res.send(err);
        });
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.specific},(err) => {
            if(!err)res.send("success");
            else res.send(err);
        });
    });
app.listen(3000, () => {
    console.log("Server started on port 3000.");
});