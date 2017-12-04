import GitHubAPI from './GitHubAPI';
import { GITHUB_TOKEN, SINCE } from '../config';
import { Logger } from '../libs/logger';

const github = new GitHubAPI(GITHUB_TOKEN);
const log = Logger('v3/controllers');


async function getForEnpoint(req, res, endpoint) {
  const { org, repo } = req.params;
  let data;
  try {
    data = await endpoint(org, repo);
  } catch (error) {
    res.status(500).json(error);
    return;
  }
  res.json(data);
}


export async function getOrgRepos(req, res) {
  return getForEnpoint(req, res, github.getOrgRepos);
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


export async function getOrgUserActivities(req, res) {
  const { org } = req.params;
  let repos;
  try {
    repos = await github.getOrgRepos(org);
  } catch (error) {
    res.status(500).json(error);
    return;
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
      .catch(handleRepoError(repo)));
    commentsCalls.push(github.getRepoIssueComments(repo.owner, repo.name)
      .catch(handleRepoError(repo)));
    commitsCalls.push(github.getRepoCommits(repo.owner, repo.name)
      .catch(handleRepoError(repo)));
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
  // Return the results as a file
  const now = new Date();
  const filename = `user-activities-${org}-${SINCE}-${now.toISOString()}.json`;
  res.setHeader('Content-disposition', `attachment; filename=${filename}`);
  const data = { issues, comments, commits };
  res.json(data);
}
