'use strict';

const express     = require('express');
const app         = express();
const Path        = require('path');
const assetFolder = Path.resolve(__dirname, '../client/');


app.use(express.static(assetFolder));


const port = process.env.PORT || 4000;

app.listen(port, function(){
  console.log("Listening on port", port)
  console.log("MAKE SOME NOISE")
});
