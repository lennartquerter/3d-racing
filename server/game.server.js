const express = require('express');
const app = express();

app.use(express.static('../site/dist'));

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: '../site/dist/'})
});

app.listen(9900, function () {
    console.log('Extreme G Racing on port 9900')
});