import { Application } from 'express';
import BlockRoutes from './block/routes';

export default (app: Application) => {
  app.use('/block', BlockRoutes);
};
