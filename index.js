'use strict';
const mongoose = require('mongoose');
const configDB = require('./configs/configDB.json');
const app = require('./app');
const port = process.env.PORT || '3999';

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose
  .connect(`${configDB.url}/${configDB.nameDB}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => console.log('Conectado'));
  })
  .catch((err) => console.log(err));
