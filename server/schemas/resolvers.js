const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

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
        createUser: async ( parent, args, { username, email, password } ) => {

            if(!username || !email || !password) {
                throw new AuthenticationError("All fields must have an imput.");
            }

            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, { user }) => {
            if(!user) {
                throw new AuthenticationError("Must be logged in to save a book.")
            }

            return await User.findOneAndUpdate(
                { _id: context.user._id },
                {$addToSet: { savedBooks: bookData }},
                {new: true}
            );
        },
        deleteBook: async (parent, { bookId }, user) => {
            if (!user) {
                throw new AuthenticationError("Must be logged in to remove a book.")
            }

            return await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
              );
        },
        login: async (parent, args, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user with this email found!');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect password!');
            }
      
            const token = signToken(user);
            return { token, user };
        },
    }
}

module.exports = resolvers;