import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

const providersRoute = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRoute.use(ensureAuthenticated);

providersRoute.get('/', providersController.index);

providersRoute.get('/:provider_id/month-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
  }
}), providerMonthAvailabilityController.index);

providersRoute.get('/:provider_id/day-availability', celebrate({
  [Segments.PARAMS]: {
    provider_id: Joi.string().uuid().required()
  }
}), providerDayAvailabilityController.index);

export default providersRoute;