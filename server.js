const { GraphQLServer, PubSub } = require("graphql-yoga");
const messages = [];
const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }
  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;
const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      pubsub.publish("MESSAGE_CHANNEL", { messages })
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, {pubsub}) => {
        setTimeout(() => pubsub.publish('MESSAGE_CHANNEL', { messages }), 0)
        return pubsub.asyncIterator("MESSAGE_CHANNEL");
      }
    }
  }
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: {pubsub, endpoint: '/'} });
server.start({ port: 5000 });
