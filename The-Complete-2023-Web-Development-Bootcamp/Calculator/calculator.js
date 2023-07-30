const express = require("express");
const bodyParser = require("body-parser");

const app = express();
//write this code line every time we use body parser
app.use(bodyParser.urlencoded({extended: true}));

//send a whole web page
app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    var num1 = Number(req.body.num1); //get num1 from html form
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send("The result of the calculations is: " + result);
});

app.listen(3000, function(){
    console.log("server has started on 3000");
}); //port 3000
