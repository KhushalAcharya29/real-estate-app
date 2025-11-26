import { Router } from 'express';
import {
  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
} from './property.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/', listProperties);
router.get('/:id', getPropertyById);

// Agent-only routes
router.get('/agent/my-properties', requireAuth, requireRole('agent'), getAgentProperties);
router.post('/agent', requireAuth, requireRole('agent'), createProperty);
router.patch('/agent/:id', requireAuth, requireRole('agent'), updateProperty);
router.delete('/agent/:id', requireAuth, requireRole('agent'), deleteProperty);

export default router;
