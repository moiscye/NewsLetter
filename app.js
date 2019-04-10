//jshint esversion:6


//declaration of npm packages
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");


//initializing express
const app = express();
//using a public folder for images and styles
app.use(express.static("public"));

// instantiating the body parser, needed to bind from html file
app.use(bodyParser.urlencoded({
  extended: true
}));

// Sending the signup form to the server
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  //fetching the data from the html form
  var name = req.body.name;
  var lastName = req.body.lastName;
  var email = req.body.email;
  console.log(name, lastName, email);

  // java script object for the mailchimp subscription
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name,
        LNAME: lastName
      }
    }],
  };

  //converting the jS object to string
  var jsonData = JSON.stringify(data);

  //Mailchimp urr. made up from our serverNumber and the listId. example below
  //'https://serverNumber.api.mailchimp.com/3.0/lists/listId'
  var baseUrl = "https://us20.api.mailchimp.com/3.0/lists/defffd9a90";
  var options = {
    url: baseUrl,
    method: "POST",
    headers: {
      "Authorization": "moises1 YOUR_API_KEY_GOES_HERE"
    },
    body: jsonData
  };

  request(options, (error, response, body) => {
    if (error) {
      console.log(error);
      // rendering failure page due to error when making the http request
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        //rendering the success page since we got the ok code
        res.sendFile(__dirname + "/success.html");
      } else {
        // rendering failure page due to error either of incorrect API id or server name
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(response.statusCode);
    }

  });

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server successfully running"));
