const app = require('./app');
const config = require('./config/config');

app.listen(config.port, () => {
  /* eslint-disable-next-line no-console */
  console.log('Sever started localhost:%s', config.port);
});
