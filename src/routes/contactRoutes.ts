import express from 'express';
import { ContactController } from '../controllers/contactController';

const router = express.Router();

// Contact routes
router.get('/', ContactController.getAllContacts);
router.get('/:id', ContactController.getContactById);
router.post('/', ContactController.createContact);
router.put('/:id', ContactController.updateContact);
router.delete('/:id', ContactController.deleteContact);

export default router;
