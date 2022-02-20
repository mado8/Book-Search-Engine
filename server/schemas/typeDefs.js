const { gql } = require('apollo-server-express')

const typeDefs = gql`

  type User {
    _id: ID
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    me: User
  } 
  
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input SaveBookInput {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth!
    saveBook(bookData: SaveBookInput!): User
    deleteBook(bookId: ID!): User
  }
`

module.exports = typeDefs