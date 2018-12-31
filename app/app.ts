import * as express from 'express';
import { IError } from './utils/error_schema';

import configureMiddlewares from './config/middlewares';
import setUpRoutes from './routes/routes';

const app: express.Application = express();

configureMiddlewares(app);
setUpRoutes(app);

app.use((err: IError, _req: express.Request, res: express.Response) =>
  res.status(500).send({
    error: err ? err.message : 'Something went wrong.'
  })
);

export default app;
