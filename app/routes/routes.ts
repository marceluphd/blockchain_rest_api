import { Application } from 'express';
import BlockRoutes from './block/routes';
import StarRoutes from './star/routes';
import ValidationRoutes from './validation/routes';

export default (app: Application) => {
  app.use(ValidationRoutes);
  app.use('/block', BlockRoutes);
  app.use('/stars', StarRoutes);
};
