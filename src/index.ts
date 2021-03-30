import 'graphql-import-node';
import { environment } from './environment';
import { graphqlUploadExpress } from 'graphql-upload';
import mongoose from 'mongoose';
import express from 'express';
import * as http from 'http';
import {
  ApolloServer,
  makeExecutableSchema,
  PubSub,
} from 'apollo-server-express';
import Consola from 'consola';
import typeDefs from './graphql/schema.graphql';
import { resolvers } from './db/resolvers';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { join } from 'path';

export const pubsub = new PubSub();

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.static(join(__dirname, './uploads')));
app.use(graphqlUploadExpress());

const schema = makeExecutableSchema({
  typeDefs: [DIRECTIVES, typeDefs],
  resolvers,
});
const server = new ApolloServer({
  schema,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

const startApp = async () => {
  try {
    await mongoose.connect(environment.database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    Consola.success({
      badge: true,
      message: `Successfully connected with the database`,
    });
    // Apply Apollo-Expr,cors: trueess-Server Middlware to express application
    server.applyMiddleware({ app, cors: true });

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(environment.port, () =>
      Consola.success({
        badge: true,
        message: `🚀 Server ready at http://localhost:${environment.port}${server.graphqlPath}`,
      })
    );
  } catch (error) {
    Consola.error({
      badge: true,
      message: error.message,
    });
  }
};

startApp();
