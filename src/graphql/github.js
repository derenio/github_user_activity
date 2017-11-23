import gql from 'graphql-tag';
import { GITHUB_TOKEN } from '../config';
import GitHubClient from './GitHubClient';


const query = gql`
  query UserActivities($org: String!) {
    organization(login: $org) {
      repositories(first: 100) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          nameWithOwner
            ...CommitsFragment
            ...IssuesFragment
        }
      }
    }
  }

  fragment CommitsFragment on Repository {
    refs(first: 100, refPrefix: "refs/heads/") {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        target {
          ... on Commit {
            oid
            commitUrl
            message
            author {
              user {
                login
              } }
            committedDate
          }
        }
      }
    }
  }

  fragment IssuesFragment on Repository {
    issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}, states: [OPEN, CLOSED]) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          state
          number
          title
          createdAt
        }
      }
    }
  }
`;


function callGitHub(req, res) {
  const { org } = req.params;
  GitHubClient.query({
    query,
    variables: {
      org,
    },
    context: {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    },
  }).then((data) => {
    res.json(data);
  }).catch((error) => {
    res.status(500).json(error);
  });
}


export default callGitHub;
