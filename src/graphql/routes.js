import { Router } from 'express';
import callGitHub from './github';


const graphqlRouter = Router();
graphqlRouter.route('/:org')
  .get(callGitHub);

export default graphqlRouter;
