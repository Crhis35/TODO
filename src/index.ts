import 'graphql-import-node';
import { environment } from './environment';
import mongoose from 'mongoose';
import express from 'express';
import * as http from 'http';
import {
  ApolloServer,
  makeExecutableSchema,
  PubSub,
} from 'apollo-server-express';

import typeDefs from './graphql/schema.graphql';
import { resolvers } from './db/resolvers';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';

export const pubsub = new PubSub();

mongoose
  .connect(environment.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB CONECTION SUCCESFULL');
  });

const schema = makeExecutableSchema({
  typeDefs: [DIRECTIVES, typeDefs],
  resolvers,
});
const server = new ApolloServer({
  schema,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(environment.port, () =>
  console.log(
    `🚀 Server ready at http://localhost:${environment.port}${server.graphqlPath}`
  )
);
