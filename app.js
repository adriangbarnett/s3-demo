const express = require("express");

const path = require('path')
require('dotenv').config({ path: '.env' })
const upload = require("express-fileupload")


// our controller and service
const s3 = require("./s3.js");

const app = express();
app.use(upload())

app.use("/", express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//
app.get("/", (req, res) => {
    res.render("index", {message: null});
})


/* -----------------------------------------------------------

    FORM + API ROUER

/* -----------------------------------------------------------*/

// Uplaod file to S3 using web form
app.post("/form/upload", s3.s3_upload_form_post);

// List file objects in S3 nuclet
app.get("/api/list", s3.s3_list_api_get);

// Uplaod file to S3
app.post("/api/upload", s3.s3_upload_api_post);

// check if file exists on S3
app.get("/api/exist", s3.s3_exist_api_get);

// download file from s3
app.get("/api/download", s3.s3_download_api_get);

// delete a file from s3
app.delete("/api/delete", s3.s3_delete_api_get);

//
app.get("*", (req, res) => {
    res.send("404");
})

app.listen(3000, () => {
    console.log("Listening...");
})