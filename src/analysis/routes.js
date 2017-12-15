import { Router } from 'express';
import { activitiesList, activityDetail, workedOn } from './controllers';


const analysisRouter = Router();
analysisRouter.route('/activities')
  .get(activitiesList);
analysisRouter.route('/activities/detail/:filename')
  .get(activityDetail);
analysisRouter.route('/activities/worked-on/:filename')
  .get(workedOn);

export default analysisRouter;
