import { Router } from 'express';
import { activitiesList, activityDetail } from './controllers';


const analysisRouter = Router();
analysisRouter.route('/activities')
  .get(activitiesList);
analysisRouter.route('/activities/detail/:filename')
  .get(activityDetail);

export default analysisRouter;
