import linkHeaderParser from 'parse-link-header';
import request from 'request-promise';
import { GITHUB_API_URL, SINCE } from '../config';
import { Logger } from '../libs/logger';
import { parseCommit, parseIssue, parseIssueComment, parseMember, parseRepo } from './parsers';

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

  getOrgRepos = async ({ org }) => {
    const path = `/orgs/${org}/repos`;
    const qs = {
      type: 'all',
    };
    const repos = await this.request({ path, qs });
    const parsedRepos = repos.map(i => parseRepo(i));
    return parsedRepos;
  }

  getOrgMembers = async ({ org }) => {
    const path = `/orgs/${org}/members`;
    const qs = {
      filter: 'all',
      role: 'all',
    };
    const repos = await this.request({ path, qs });
    const parsedMembers = repos.map(i => parseMember(i));
    return parsedMembers;
  }

  getRepoIssues = async ({ org, repo, login = null }) => {
    const path = `/repos/${org}/${repo}/issues`;
    const qs = {
      since: SINCE,
      state: 'all',
      sort: 'created',
      direction: 'asc',
    };
    if (login) {
      qs.creator = login;
    }
    const issues = await this.request({ path, qs });
    const parsedIssues = issues.map(i => parseIssue(i, org, repo));
    return parsedIssues;
  }

  getRepoIssueComments = async ({ org, repo, login = null }) => {
    const path = `/repos/${org}/${repo}/issues/comments`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    let comments = await this.request({ path, qs });
    if (login) {
      comments = comments.filter(c => c.user.login === login);
    }
    const parsedComments = comments.map(i => parseIssueComment(i, org, repo));
    return parsedComments;
  }

  getRepoCommits = async ({ org, repo, login = null }) => {
    const path = `/repos/${org}/${repo}/commits`;
    // Commits are returned in descending order sorted by the updated_at field
    const qs = {
      since: SINCE,
    };
    if (login) {
      qs.author = login;
    }
    const commits = await this.request({ path, qs });
    const parsedCommits = commits.map(i => parseCommit(i, org, repo));
    return parsedCommits;
  }
}


export default GitHubAPI;
