const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

module.exports = app => {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
};
