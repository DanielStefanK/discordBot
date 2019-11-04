require("dotenv").config();
const { ApolloServer } = require("apollo-server");

const client = require("./loginBot");

// The GraphQL schema in string form
const typeDefs = require("./schema");

// The resolvers
const resolvers = require("./resolvers");

// Put together a schema

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      discord: client
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
