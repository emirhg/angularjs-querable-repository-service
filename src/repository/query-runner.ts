import {
  graphql
} from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';


export class QueryRunner {
  private resolvers = [{}];
  private typeDefs = [];
  private schema;

  public appendTypeDef(typeDef) {
    this.typeDefs.push(typeDef);
  }

  public appendResolvers(resolvers) {
    this.resolvers.push(resolvers);
  }

  private canExecute(): boolean {
    return this.resolvers && !!this.resolvers.length
      && this.typeDefs && !!this.typeDefs.length;
  }

  private makeExecutableSchema() {
    this.schema = makeExecutableSchema({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers
    });

    return this.schema;
  }

  public runQuery(query: any) {
    if (!this.canExecute()) {
      throw new Error('Cannot execute query. Are the TypeDefinition and Resolvers setted');
    }

    this.makeExecutableSchema();
    return graphql(this.schema, query);
  }
}
