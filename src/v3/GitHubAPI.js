import linkHeaderParser from 'parse-link-header';
import request from 'request-promise';
import { GITHUB_API_URL, SINCE } from '../config';
import { Logger } from '../libs/logger';
import { parseCommit, parseIssue, parseIssueComment, parseRepo } from './parsers';

const log = Logger('v3/GitHubAPI');


class GitHubAPI {
  constructor(token) {
    this.token = token;
  }

  request(options) {
    const { path, qs } = options;
    const url = `${GITHUB_API_URL}${path}`;

    const opts = {
      qs: {
        ...qs,
        per_page: 100,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${this.token}`,
        'User-Agent': 'Awesome-Octocat-App',
      },
      json: true,
      resolveWithFullResponse: true,
    };

    const getPages = async (pageUrl, acc) => {
      log.info(`GET ${pageUrl}`);
      const pageOpts = { ...opts, url: pageUrl };
      const res = await request.get(pageOpts);
      let data = res.body;
      const link = linkHeaderParser(res.headers.link);
      if (link && link.next) {
        const newAcc = acc.concat(data);
        return getPages(link.next.url, newAcc);
      }
      if (acc) {
        data = acc.concat(data);
      }
      return data;
    };

    return getPages(url, []);
  }

  getOrgRepos = async (user) => {
    const path = `/users/${user}/repos`;
    const qs = {
      type: 'all',
    };
    const repos = await this.request({ path, qs });
    const parsedRepos = repos.map(i => parseRepo(i));
    return parsedRepos;
  }

  getRepoIssues = async (owner, repo) => {
    const path = `/repos/${owner}/${repo}/issues`;
    const qs = {
      since: SINCE,
      state: 'all',
      sort: 'created',
      direction: 'asc',
    };
    const issues = await this.request({ path, qs });
    const parsedIssues = issues.map(i => parseIssue(i, owner, repo));
    return parsedIssues;
  }

  getRepoIssueComments = async (owner, repo) => {
    const path = `/repos/${owner}/${repo}/issues/comments`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    const comments = await this.request({ path, qs });
    const parsedComments = comments.map(i => parseIssueComment(i, owner, repo));
    return parsedComments;
  }

  getRepoCommits = async (owner, repo) => {
    const path = `/repos/${owner}/${repo}/commits`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    const commits = await this.request({ path, qs });
    const parsedCommits = commits.map(i => parseCommit(i, owner, repo));
    return parsedCommits;
  }
}


export default GitHubAPI;
