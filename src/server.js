const express = require('express');
const app = express();
const morgan = require('morgan');
var port = 3000

app.set('port', port)
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json())

app.use('/api/v1', require('./routes/v1'))

app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
  });