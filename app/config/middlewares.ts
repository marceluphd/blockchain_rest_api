import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { Application } from 'express';
import * as helmet from 'helmet';

export default (app: Application) => {
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
};
