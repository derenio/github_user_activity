

export function parseRepo(repo) {
  const {
    html_url, name, owner, created_at, updated_at,
  } = repo;
  return {
    html_url,
    owner: owner && owner.login,
    name,
    dayOfWeek: new Date(created_at).getDay(),
    hourOfDay: new Date(created_at).getHours(),
    createdAt: created_at,
    updatedAt: updated_at,
  };
}


export function parseMember(member, org, repo) {
  const { html_url, login } = member;
  return { html_url, login };
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
    author: user && user.login,
    assignees: assignees.map(a => a && a.login),
    dayOfWeek: new Date(created_at).getDay(),
    hourOfDay: new Date(created_at).getHours(),
    createdAt: created_at,
    updatedAt: updated_at,
  };
}
const COMMENT_ISSUE_NUMBER_RE = /^https:\/\/github.com\/[^/]*\/[^/]*\/(?:issues|pull)\/(\d*)#issuecomment-(\d*)$/;


export function parseIssueComment(comment, org, repo) {
  const {
    html_url, body, user, created_at, updated_at,
  } = comment;
  let issueNumber = null;
  const urlMatch = COMMENT_ISSUE_NUMBER_RE.exec(html_url);
  if (urlMatch) {
    issueNumber = parseInt(urlMatch[1], 10);
  }
  return {
    html_url,
    org,
    repo,
    issueNumber,
    body,
    author: user && user.login,
    dayOfWeek: new Date(created_at).getDay(),
    hourOfDay: new Date(created_at).getHours(),
    createdAt: created_at,
    updatedAt: updated_at,
  };
}


export function parseCommit(commitData, org, repo) {
  const {
    sha, html_url, commit, author, committer,
  } = commitData;
  return {
    html_url,
    org,
    repo,
    sha,
    message: commit && commit.message,
    author: author && author.login,
    committer: committer && committer.login,
    dayOfWeek: (new Date(commit.author.date)).getDay(),
    hourOfDay: (new Date(commit.author.date)).getHours(),
    createdAt: commit.author.date,
    updatedAt: commit.committer.date,
  };
}
