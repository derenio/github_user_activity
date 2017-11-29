import GitHubAPI from './GitHubAPI';
import { GITHUB_TOKEN } from '../config';


const github = new GitHubAPI(GITHUB_TOKEN);


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


export function getOrgUserActivities(req, res) {
  const { org } = req.params;
}
