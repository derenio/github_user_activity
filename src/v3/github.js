import GitHubAPI from './GitHubAPI';
import { GITHUB_TOKEN } from '../config';
import { parseComment, parseCommit, parseIssue, parseRepo } from './parsers';


const github = new GitHubAPI(GITHUB_TOKEN);


export function getOrgRepos(req, res) {
  const { org } = req.params;
  github.getOrgRepos(org, (error, data) => {
    if (error) {
      res.status(500).end(error);
    }
    const parsedData = data.map(r => parseRepo(r));
    res.json(parsedData);
  });
}


export function getRepoIssues(req, res) {
  const { org, repo } = req.params;
  github.getRepoIssues(org, repo, (error, data) => {
    if (error) {
      res.status(500).end(error);
    }
    const parsedData = data.map(i => parseIssue(i, org, repo));
    res.json(parsedData);
  });
}


export function getRepoIssueComments(req, res) {
  const { org, repo } = req.params;
  github.getRepoIssueComments(org, repo, (error, data) => {
    if (error) {
      res.status(500).end(error);
    }
    const parsedData = data.map(c => parseComment(c, org, repo));
    res.json(parsedData);
  });
}


export function getRepoCommits(req, res) {
  const { org, repo } = req.params;
  github.getRepoCommits(org, repo, (error, data) => {
    if (error) {
      res.status(500).end(error);
    }
    const parsedData = data.map(c => parseCommit(c, org, repo));
    res.json(parsedData);
  });
}
