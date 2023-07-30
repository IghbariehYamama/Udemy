const express = require("express");

const app = express();

//request access and get data as a response 
//home page route
app.get("/", function(request, response){
    response.send("<h1>hello world</h1>");
});

//contact page route
app.get("/contact", function(request, response){
    response.send("contact at yamama@gmail.com");
});

//about page route
app.get("/about", function(request, response){
    response.send("i love pets");
});

app.listen(3000, function(){
    console.log("server has started on 3000");
}); //port 3000

