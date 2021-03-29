import {
  MutationCreateItemArgs,
  MutationUpdateItemArgs,
  MutationDeleteItemArgs,
  QueryGetItemArgs,
  QueryListItemsArgs,
} from '../generated/graphql';
import { ApolloError } from 'apollo-server-express';
import { pubsub } from '../index';
import Item from './models/Items';

const todoList = require('./list.json');

const ITEM_CREATED = 'ITEM_CREATED';
const ITEM_UPDATED = 'ITEM_UPDATED';
const ITEM_DELETED = 'ITEM_DELETED';

export const resolvers = {
  Query: {
    listItems: async (
      _: any,
      { search, page, limit, sort }: QueryListItemsArgs
    ) => {
      try {
        const currentPage = page || 1;
        const limitLen = limit || 10;
        let searchQuery = {};
        let sortBy: any = {};
        // run if search is provided
        if (search) {
          // update the search query
          searchQuery = {
            $or: [{ title: { $regex: search, $options: 'i' } }],
          };
        }
        if (sort) sortBy[sort.field] = sort.order === 'ASC' ? 1 : -1;

        const items = await Item.find(searchQuery)
          .limit(limitLen)
          .skip((currentPage - 1) * limitLen)
          .lean();
        const count = await Item.countDocuments(searchQuery);
        return {
          items,
          totalPages: Math.ceil(count / limitLen),
          currentPage,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    getItem: async (_: any, { id }: QueryGetItemArgs) => {
      try {
        return await Item.findById(id);
      } catch (error) {
        throw new ApolloError('ID item no found');
      }
    },
  },
  Mutation: {
    createItem: async (_: any, { input }: MutationCreateItemArgs) => {
      try {
        const item = await Item.create({
          ...input,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        pubsub.publish(ITEM_CREATED, { onItemCreated: item });
        return item;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    updateItem: async (_: any, { id, input }: MutationUpdateItemArgs) => {
      try {
        const item = await Item.findOneAndUpdate(
          { id },
          {
            ...input,
            updatedAt: new Date(),
          },
          {
            new: true,
          }
        );
        pubsub.publish(ITEM_UPDATED, { onItemUpdated: item });
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
    deleteItem: async (_: any, { id }: MutationDeleteItemArgs) => {
      try {
        const item = await Item.deleteOne({ id });

        pubsub.publish(ITEM_DELETED, { onItemDeleted: item });
        return 'Deleted';
      } catch (error) {
        new ApolloError(error.message);
      }
    },
  },
  Subscription: {
    onItemCreated: {
      subscribe: () => pubsub.asyncIterator(['ITEM_CREATED']),
    },
    onItemUpdated: {
      subscribe: () => pubsub.asyncIterator(['ITEM_UPDATED']),
    },
    onItemDeleted: {
      subscribe: () => pubsub.asyncIterator(['ITEM_DELETED']),
    },
  },
};
