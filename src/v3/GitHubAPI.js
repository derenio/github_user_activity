import request from 'request-promise';
import linkHeaderParser from 'parse-link-header';
import { GITHUB_API_URL, SINCE } from '../config';


class GitHubAPI {
  constructor(token) {
    this.token = token;
    this.getOrgRepos = this.getOrgRepos.bind(this);
    this.getRepoIssues = this.getRepoIssues.bind(this);
    this.getRepoIssueComments = this.getRepoIssueComments.bind(this);
    this.getRepoCommits = this.getRepoCommits.bind(this);
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

  async getOrgRepos(user) {
    const path = `/users/${user}/repos`;
    const qs = {
      type: 'all',
    };
    return this.request({ path, qs });
  }

  async getRepoIssues(owner, repo) {
    const path = `/repos/${owner}/${repo}/issues`;
    const qs = {
      since: SINCE,
      state: 'all',
      sort: 'created',
      direction: 'asc',
    };
    return this.request({ path, qs });
  }

  async getRepoIssueComments(owner, repo) {
    const path = `/repos/${owner}/${repo}/issues/comments`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    return this.request({ path, qs });
  }

  async getRepoCommits(owner, repo) {
    const path = `/repos/${owner}/${repo}/commits`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    return this.request({ path, qs });
  }
}


export default GitHubAPI;
