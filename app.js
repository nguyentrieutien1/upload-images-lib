require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const AppError = require("./utils/appError");
const profiles = require("./api/profile/profile.router");
const cors = require("cors")
app.use(cors())
app.use(express.json());
app.use('/upload', express.static('upload/images'));
app.use("/api/images", profiles);

app.get("/", (req, res) => {
    return res.json({ message: "Hello, site for upload image of 1kview.cloud" })
})
app.get('/upload-image', (req, res) => {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});
app.all('*', (req, res, next) => {
    throw new AppError(`Requested URL ${req.path} not found!`, 404);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});
