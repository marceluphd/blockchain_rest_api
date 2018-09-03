import { Router } from 'express';
const router: Router = Router();

import controller from './controller';

router.route('/hash::hash').get(controller.getByHash);
router.route('/address::address').get(controller.getByAddress);

export default router;
