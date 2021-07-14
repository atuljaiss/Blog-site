const express = require("express");
const bodyParser = require("body-parser");
const lodash = require('lodash');
const mongoose = require ("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect('mongodb+srv://atuljaiss:xyz@9065@cluster0.dgrh0.mongodb.net/blog', {useNewUrlParser: true, useUnifiedTopology: true});

const blogSchema = {
    title:{
        type:String,
        required:true,
    },
    post:{
        type:String,
        required:true,
    },
    name:String,
    date:String,
    
}
const Blog = mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    Blog.find({},function(err,foundBlog){
        if(!err){
            if(foundBlog==0){
                res.render("empty");     
            }else{
                res.render("main",{blog:foundBlog});
            }    
        }
    })
    
});
app.get("/about",function(req,res){
    res.render("about");
});
app.get("/contact",function(req,res){
    res.render("contact");
});
app.get("/compose",function(req,res){
    res.render("compose");
});
app.post("/compose",function(req,res){
    const inputTitle = req.body.title;
    const inputPost = req.body.post; 
    const name=req.body.name;
    var today = new Date();
    var options = {
        day : "numeric",
        year : "numeric",
        month : "numeric"
       
    }
   var date = today.toLocaleDateString("en-US",options);
    console.log(date);
    const blog = new Blog({
        title:  lodash.capitalize(inputTitle),
        post: inputPost,
       name:lodash.capitalize(name)||"Anonymous",
       date:date
    });
    blog.save();   
    /* title.push(req.body.title);
     post.push(req.body.post);*/
    
    res.redirect("/");
}) 
app.get("/post/:titleOfPost",function(req,res){
   
    console.log(req.params);
    var requestedTitle = req.params.titleOfPost;
    requestedTitle = lodash.lowerCase(requestedTitle);
    requestedTitle= lodash.capitalize(requestedTitle);
    console.log(requestedTitle);

    Blog.findOne({title:requestedTitle},function(err,foundpost){
        if(!err){
            if(!foundpost){
                res.send("Broken Link!!");
            }else{
                res.render("post",{blog:foundpost});
            }
        }
    });
    /*for(var i = 0; i<title.length;i++){
        var postTitle = title[i];
        postTitle = lodash.lowerCase(postTitle);
        if( postTitle ==  requestedTitle){
            console.log("Match Found");
            index= i;
            flag=0;
            res.render("post",{title:title[index],post:post[index]});
        }     
    }
    if(flag==1){
        res.send("Broken Link!!");
    }*/
});
app.post("/post/:titleOfPost",function(req,res){
    
    var titleofPost=req.body.yo;
    titleofPost = lodash.capitalize(titleofPost);
    console.log("delete:"+titleofPost);
    Blog.deleteOne({title:titleofPost},function(err,postdelete){
        if(!err){
            if(!postdelete){
                console.log("not found");
            }else{
                console.log("success");
            }
        }
    });
   /* for(var i = 0; i<title.length;i++){

        var postTitle = title[i];
        console.log("yo");
        postTitle = lodash.lowerCase(postTitle);
        if( postTitle ==  titleofPost){
            console.log("Match Found to delete");
            title.splice(i,1);
            post.splice(i,1);
        }     
    }*/
    res.redirect("/");
});
const port = process.env.PORT || 3000;

app.listen(port,function(){
    console.log("3000");
})