const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { AggregationCursor } = require('mongoose');

const resolvers = {
    Query: {
        me: async ( parent, args, { user } ) => {
            if(!context.user) {
                throw new AuthenticationError("Must be logged in");
            }
            return await User.findOne({_id: user._id})
        },
    },
    Mutation: {
        createUser: async (parent, args) => {
            if(!args) {
                throw new AuthenticationError("Must input all fields!")
            }
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, { user }) => {
            if(!user) {
                throw new AuthenticationError("Must be logged in to save a book.")
            }

            return await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData }},
                { new: true }
              );
        },
        deleteBook: async (parent, { bookId }, user) => {
            if (!user) {
                throw new AuthenticationError("Must be logged in to remove a book.")
            }

            return await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId }}},
            );
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found.');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
        },
    }
}

module.exports = resolvers;