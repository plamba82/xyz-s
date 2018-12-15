const express = require("express");
const app = express();
const hostname = "localhost";
const port = 8081;

app.use(express.static('.'));

app.listen(port, hostname);