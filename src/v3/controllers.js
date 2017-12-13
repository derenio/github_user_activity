import path from 'path';

import GitHubAPI from './GitHubAPI';
import { GITHUB_TOKEN, SINCE } from '../config';
import { Logger } from '../libs/logger';
import { getDataFilenames, loadData, writeData } from '../libs/data';

const github = new GitHubAPI(GITHUB_TOKEN);
const log = Logger('v3/controllers');


async function getForEnpoint(req, res, endpoint) {
  const { org, repo } = req.params;
  let data;
  try {
    data = await endpoint(org, repo);
  } catch (error) {
    log.error(error);
    res.status(500).json(error);
    return;
  }
  res.json(data);
}


export async function getOrgRepos(req, res) {
  return getForEnpoint(req, res, github.getOrgRepos);
}


export async function getOrgMembers(req, res) {
  return getForEnpoint(req, res, github.getOrgMembers);
}


export async function getRepoIssues(req, res) {
  return getForEnpoint(req, res, github.getRepoIssues);
}


export async function getRepoIssueComments(req, res) {
  return getForEnpoint(req, res, github.getRepoIssueComments);
}


export async function getRepoCommits(req, res) {
  return getForEnpoint(req, res, github.getRepoCommits);
}


export async function listOrgUserActivities(req, res) {
  const { org } = req.params;
  const dataFilenames = getDataFilenames().filter(name => name.includes(org));
  const context = {
    org,
    dataFilenames,
  };
  res.render(path.join(__dirname, '/views/activities_list'), context);
}


export async function getOrgUserActivitiesDetail(req, res) {
  const { filename } = req.params;
  let data;
  try {
    data = loadData(filename);
  } catch (error) {
    log.error(error);
    res.status(500).json(error);
    return;
  }
  res.json(data);
}


export async function fetchOrgUserActivities(req, res) {
  const { org } = req.params;
  let repos;
  try {
    repos = await github.getOrgRepos(org);
  } catch (error) {
    log.error(error);
    res.status(500).json(error);
    return;
  }
  let members;
  try {
    members = await github.getOrgMembers(org);
  } catch (error) {
    log.error(error);
    res.status(500).json(error);
    return;
  }
  const memberLoginsSet = new Set(members.map(m => m.login));

  function filterMembers(assets) {
    return assets.filter(a => memberLoginsSet.has(a.author));
  }

  function handleRepoError(repo) {
    return (error) => {
      log.error(`Repo ${repo.owner}/${repo.name}`);
      log.error(error);
      return [];
    };
  }

  // Generate issues, comments and commits promises for every repository
  const issuesCalls = [];
  const commentsCalls = [];
  const commitsCalls = [];
  repos.forEach((repo) => {
    issuesCalls.push(github.getRepoIssues(repo.owner, repo.name)
      .then(filterMembers).catch(handleRepoError(repo)));
    commentsCalls.push(github.getRepoIssueComments(repo.owner, repo.name)
      .then(filterMembers).catch(handleRepoError(repo)));
    commitsCalls.push(github.getRepoCommits(repo.owner, repo.name)
      .then(filterMembers).catch(handleRepoError(repo)));
  });

  function flatten(arr) {
    const result = [];
    arr.forEach(subArr => subArr.forEach(elem => result.push(elem)));
    return result;
  }

  function handleError(error) {
    log.error(error);
    return [];
  }

  // Await all the promises
  let issues;
  let comments;
  let commits;
  try {
    [issues, comments, commits] = await Promise.all([
      Promise.all(issuesCalls).then(flatten).catch(handleError),
      Promise.all(commentsCalls).then(flatten).catch(handleError),
      Promise.all(commitsCalls).then(flatten).catch(handleError),
    ]);
  } catch (error) {
    res.status(500).json(error);
    return;
  }
  const data = { issues, comments, commits };
  // Save the data to the "data" directory
  const to = (new Date()).toISOString();
  const filename = `user-activities-${org}-${SINCE}-${to}.json`;
  writeData(filename, data);
  // Redirect to the data page
  res.redirect(`/v3/orgs/${org}/user-activities/detail/${filename}`);
}
