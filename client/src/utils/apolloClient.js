import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  uri: process.env.REACT_APP_BASE_URL,
});

export default client;
