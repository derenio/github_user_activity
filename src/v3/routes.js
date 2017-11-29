import { Router } from 'express';
import {
  getOrgRepos, getOrgUserActivities, getRepoCommits, getRepoIssueComments,
  getRepoIssues } from './views';


const v3Router = Router();
v3Router.route('/users/:org/repos')
  .get(getOrgRepos);
v3Router.route('/users/:org/user-activities')
  .get(getOrgUserActivities);
v3Router.route('/repos/:org/:repo/issues')
  .get(getRepoIssues);
v3Router.route('/repos/:org/:repo/issues/comments')
  .get(getRepoIssueComments);
v3Router.route('/repos/:org/:repo/commits')
  .get(getRepoCommits);


export default v3Router;
