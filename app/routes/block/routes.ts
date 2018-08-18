import { Router } from 'express';
const router: Router = Router();

import controller from './controller';

router.route('/').post(controller.addBlock);
router.route('/all').get(controller.getAllBlocks);
router.route('/height').get(controller.getBlockHeight);
router.route('/validate_all').get(controller.validateBlockchain);
router.route('/validate/:id').get(controller.validateBlock);
router.route('/:id').get(controller.getBlock);

export default router;
