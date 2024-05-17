import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";
// server setup

const resolvers = {
  Query: {
    games() {
      return db.games;
    },

    reviews() {
      return db.reviews;
    },
    authors() {
      return db.authors;
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },

  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((a) => a.id === parent.game_id);
    },
  },

  Mutation: {
    deleteGame(_, args) {
      return db.games.filter((game) => game.id !== args.id);
    },
    addGame(_, args) {
      const id = Number(db.games[db.games.length - 1].id) + 1;
      const newGame = { id: id.toString(), ...args.game };
      db.games.push(newGame);
      return newGame;
    },
  },
};
const server = new ApolloServer({
  // typeDefs --- definitions of types of data
  // the compbinations of all these typeDefs and the relationship to all the types and kinds of quires that can be made combined to make something called schema
  // schema- is something that describes the shape of the graph and the data availale on it
  //resolvers

  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log("server ready at port ", 4000);
