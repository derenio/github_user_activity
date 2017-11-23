const COMMENT_ISSUE_NUMBER_RE = /^https:\/\/github.com\/[^/]*\/[^/]*\/issues\/(\d*)#issuecomment-(\d*)$/;


export function parseComment(comment, org, repo) {
  const {
    html_url, body, user, created_at, updated_at,
  } = comment;
  const issueNumber = parseInt(COMMENT_ISSUE_NUMBER_RE.exec(html_url)[1], 10);
  return {
    html_url,
    org,
    repo,
    issueNumber,
    body,
    author: user.login,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}


export function parseCommit(commit, org, repo) {
  const {
    sha, html_url, author, committer, created_at, updated_at,
  } = commit;
  return {
    html_url,
    org,
    repo,
    sha,
    author: author.login,
    committer: committer.login,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}


export function parseIssue(issue, org, repo) {
  const {
    html_url, title, number, state, body, user, assignees, created_at, updated_at,
  } = issue;
  return {
    html_url,
    org,
    repo,
    title,
    number,
    state,
    body,
    author: user.login,
    assignees: assignees.map(a => a.login),
    createdAt: created_at,
    updatedAt: updated_at,
  };
}


export function parseRepo(repo) {
  const {
    html_url, name, owner, created_at, updated_at,
  } = repo;
  return {
    html_url,
    owner: owner.login,
    name,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}
