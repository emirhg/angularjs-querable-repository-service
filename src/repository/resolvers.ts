export const resolvers = {
  Query: {
    user: () => ({
      name: 'Test',
      email: 'test@doamin.com'
    })
  }
};

export default resolvers;
