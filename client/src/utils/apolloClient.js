import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
const httpLink = createUploadLink({
  uri: process.env.REACT_APP_BASE_URL,
});
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: httpLink,
});

export default client;
