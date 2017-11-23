import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const GitHubClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.github.com/graphql',
    fetch,
  }),
  cache: new InMemoryCache(),
});

export default GitHubClient;
