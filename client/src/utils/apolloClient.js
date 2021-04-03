import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    reconnect: true,
  },
});
const httpLink = createHttpLink({
  uri: `http:${process.env.REACT_APP_BASE_URL}`,
});
const UploadLink = createUploadLink({
  uri: `http:${process.env.REACT_APP_BASE_URL}`,
});
const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([UploadLink, httpLink, wsLink]),
});

export default client;
