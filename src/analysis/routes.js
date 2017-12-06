import { Router } from 'express';
import { activities } from './controllers';


const analysisRouter = Router();
analysisRouter.route('/activities')
  .get(activities);

export default analysisRouter;
