const express = require("express")
var app = express()

app.use(express.static('./public'));


//LISTEN FROM SERVER
const PORT = 80;
const HOST = '0.0.0.0';

//app.listen(PORT, () => {
//    console.log(`Server is listening on port ${PORT}`);
//  });

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);