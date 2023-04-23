const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app= express();

//to get static file/local file
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
});

//post
app.post("/",function(req,res)
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email    
    console.log(firstName,lastName,email);

    const data = {
        members: [
            {
                email_address : email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/";

    const option={
        method: "POST",
        auth: ""		//your api key
    }
    
    const request = https.request(url,option,function(response)
    {
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    })

    request.write(jsonData);
    request.end();
    
});

// '/fail/ route
app.post("/fail",function(req,res){
    res.redirect("/");
});

app.listen(3000,function()
{
    console.log("Serer's running on 3000");
});

