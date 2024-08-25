import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import validateId from '../middlewares/validateId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.use('/:contactId', validateId('contactId'));
router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post(
  '',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.put(
  '/:contactId',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);
router.patch(
  '/:contactId',
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
