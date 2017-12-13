import { Router } from 'express';
import {
  getOrgMembers, getOrgRepos, listOrgUserActivities, getOrgUserActivitiesDetail,
  fetchOrgUserActivities, getRepoCommits, getRepoIssueComments, getRepoIssues,
} from './controllers';


const v3Router = Router();
v3Router.route('/orgs/:org/members')
  .get(getOrgMembers);
v3Router.route('/orgs/:org/repos')
  .get(getOrgRepos);
v3Router.route('/orgs/:org/user-activities')
  .get(listOrgUserActivities)
  .post(fetchOrgUserActivities);
v3Router.route('/orgs/:org/user-activities/detail/:filename')
  .get(getOrgUserActivitiesDetail);
v3Router.route('/repos/:org/:repo/issues')
  .get(getRepoIssues);
v3Router.route('/repos/:org/:repo/issues/comments')
  .get(getRepoIssueComments);
v3Router.route('/repos/:org/:repo/commits')
  .get(getRepoCommits);


export default v3Router;
