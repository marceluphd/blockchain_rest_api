import { Router } from 'express';
const router: Router = Router();

import controller from './controller';

router.route('/requestValidation').post(controller.validateRequest);
router.route('/message-signature/validate').post(controller.validateMsgSig);

export default router;
