var express = require('express');
var app = express();
var port = process.env.PORT || 1121;

app.listen(port, function() {
    console.log('Running Yama at:' + port);
});