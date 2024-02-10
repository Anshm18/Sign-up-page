const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const config = require(__dirname+"/config.js");

const api_key = config.api_key;
const audience_id = config.audience_id;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,function (){
    console.log("server started at 3000");
});

app.get("/",function (req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post('/',function (req,res){
    const name = req.body.name;
    const mail = req.body.email;
    
    const data = {
        members:[
            {
                email_address: mail,
                status: 'subscribed',
                merge_fields: {
                    FNAME: name
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    
    const url = 'https://us21.api.mailchimp.com/3.0/lists/'+audience_id;
    const option = {
        method : 'POST',
        auth : "Ansh:"+api_key
    }

    const request = https.request(url,option, function (response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function (data){
           
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function (req,res){
    res.redirect('/');
})
