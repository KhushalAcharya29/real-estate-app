import { Router } from 'express';
import {
  expressInterest,
  getMyInterests,
  removeInterest,
  getInterestedClients,
} from './interest.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// Client routes
router.post('/', requireAuth, requireRole('client'), expressInterest);
router.get('/', requireAuth, requireRole('client'), getMyInterests);
router.delete('/:propertyId', requireAuth, requireRole('client'), removeInterest);

// Agent routes
router.get('/property/:propertyId/clients', requireAuth, requireRole('agent'), getInterestedClients);

export default router;
