import { QueryRunner } from './query-runner';
import * as SimpleTypeDef from './simple-type-def.gql';
import * as MUTATION_QUERY from './mutation-query.gql';
import * as READ_QUERY from './query.gql';
import resolvers from './resolvers';

const typeDefs = SimpleTypeDef;

// BUG: Restarting the karma runner ends with "Unexpected end of input" error

describe('GraphORM', () => {
  let queryRunner;

  beforeEach(() => {
    queryRunner = new QueryRunner();
  });

  it('should create an instance', () => {
    expect(queryRunner).toBeTruthy();
  });

  it('should throw an Error if a query is runned without Resolvers or Types', () => {
    expect(() => queryRunner.runQuery(READ_QUERY)).toThrowError(Error);
  });

  describe('GraphQL Implementation', () => {
    it('should resolve a query', (done) => {
      queryRunner.appendTypeDef(typeDefs);
      queryRunner.appendResolvers(resolvers);

      queryRunner.runQuery(READ_QUERY)
      .then((response: {data: {user}, errors?: any} ) => {
        expect(response.errors).toBeUndefined(String(response.errors));

        expect(response).toBeTruthy();
        expect(response.data).toBeTruthy();
        expect(response.data.user).toBeTruthy();
        expect(response.data.user.name).toBe('Test');
        done();
      });
    });

    it('should mutate an object', (done) => {
      queryRunner.appendTypeDef(typeDefs);
      queryRunner.appendResolvers(resolvers);
      queryRunner.appendTypeDef('type Mutation { user(input: String): User }');
      queryRunner.appendResolvers({
        Mutation: {
          user: (input) => ({
            name: 'Mutated',
            email: 'mutated@email.com'
          })
        }
      });

      queryRunner.runQuery(MUTATION_QUERY)
      .then((response: {data: {user}, errors?: any} ) => {
        expect(response.errors).toBeUndefined(String(response.errors));

        expect(response).toBeTruthy();
        expect(response.data).toBeTruthy();
        expect(response.data.user).toBeTruthy();
        expect(response.data.user.name).toBe('Mutated');
        done();
      });
    });
  });


  // it('should register a new GraphQLObjectType');
  // it('should register a new GraphQLObjectType\'s field/property');
  // it('should record an entity\'s property on a persistent dataset');
});
