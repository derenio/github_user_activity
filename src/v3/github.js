import GitHubAPI from './GitHubAPI';
import { GITHUB_TOKEN } from '../config';
import { parseCommit, parseIssue, parseIssueComment, parseRepo } from './parsers';


const github = new GitHubAPI(GITHUB_TOKEN);


async function getForEnpointAndParser(req, res, endpoint, parser) {
  const { org, repo } = req.params;
  let data;
  try {
    data = await endpoint(org, repo);
  } catch (error) {
    res.status(500).json(error);
    return;
  }
  const parsedData = data.map(i => parser(i, org, repo));
  res.json(parsedData);
}


export async function getOrgRepos(req, res) {
  return getForEnpointAndParser(req, res, github.getOrgRepos, parseRepo);
}


export async function getRepoIssues(req, res) {
  return getForEnpointAndParser(req, res, github.getRepoIssues, parseIssue);
}


export async function getRepoIssueComments(req, res) {
  return getForEnpointAndParser(
    req, res,
    github.getRepoIssueComments,
    parseIssueComment,
  );
}


export async function getRepoCommits(req, res) {
  return getForEnpointAndParser(req, res, github.getRepoCommits, parseCommit);
}


export function getOrgUserActivities(req, res) {
  const { org } = req.params;
}
