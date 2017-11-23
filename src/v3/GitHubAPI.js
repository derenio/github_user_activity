import request from 'request';
import linkHeaderParser from 'parse-link-header';
import { GITHUB_API_URL, SINCE } from '../config';


class GitHubAPI {
  constructor(token) {
    this.token = token;
  }

  request(options, callback) {
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
    };

    function getPages(pageUrl, acc) {
      const pageOpts = { ...opts, url: pageUrl };
      request.get(pageOpts, (error, res, body) => {
        if (error) {
          callback(error);
          return;
        }
        let json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          callback(e);
          return;
        }
        const link = linkHeaderParser(res.headers.link);
        if (link && link.next) {
          const newAcc = acc.concat(json);
          getPages(link.next.url, newAcc);
        } else {
          let data = json;
          if (acc) {
            data = acc.concat(json);
          }
          callback(null, data);
        }
      });
    }

    getPages(url, [], callback);
  }

  getOrgRepos(user, callback) {
    const path = `/users/${user}/repos`;
    const qs = {
      type: 'all',
    };
    this.request({ path, qs }, callback);
  }

  getRepoIssues(owner, repo, callback) {
    const path = `/repos/${owner}/${repo}/issues`;
    const qs = {
      since: SINCE,
      state: 'all',
      sort: 'created',
      direction: 'asc',
    };
    this.request({ path, qs }, callback);
  }

  getRepoIssueComments(owner, repo, callback) {
    const path = `/repos/${owner}/${repo}/issues/comments`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    this.request({ path, qs }, callback);
  }

  getRepoCommits(owner, repo, callback) {
    const path = `/repos/${owner}/${repo}/commits`;
    const qs = {
      since: SINCE,
      sort: 'created',
      direction: 'asc',
    };
    this.request({ path, qs }, callback);
  }
}


export default GitHubAPI;
