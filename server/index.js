'use strict';

let http        = require('http');
let express     = require('express');
let Path        = require('path')
let assetFolder = Path.resolve(__dirname, '../client/')
let app         = express();
let rootPath    = Path.normalize(__dirname + '../client');


app.use(express.static(assetFolder));
app.use("/style", express.static(rootPath + '/style'));
app.use("/script", express.static(rootPath + '/script'));




let port = process.env.PORT
app.listen(port || 4000, function(){
  console.log("Listening on port", port)
})
