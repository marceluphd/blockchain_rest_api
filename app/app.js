const express = require('express');

const app = express();
const routes = require('./routes/routes');

require('./config/middlewares')(app);

app.use(routes);

app.use((err, req, res) =>
  res.status(500).send({
    error: 'Something went wrong.'
  })
);

module.exports = app;
