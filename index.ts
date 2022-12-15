import { buildSchema } from 'graphql';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';

// Data hårdkodad in vår kod istället för att hämta från en databas
//............//
export const apples = [
    { id: 1, name: 'Green apple', taste: "Sour"},
    { id: 2, name: 'Red Apple', taste: "Sweet & Sour"},
    { id: 3, name: 'Pink Apple', taste: "Very Sweet"}
];

// Schema
//--------------------//
export const schema = buildSchema(`
    type Query {
        getApple(id: Int!): Apple
        getApples: [Apple]
    }

    type Apple {
        id: Int!
        name: String!
        taste: String!
    }

    input AppleInput {
        name: String!
        taste: String!
    }

    type Mutation {
        createApple(input: AppleInput): Apple
        updateApple(id: Int!, input: AppleInput): Apple
    }
`);
//--------------------//

type Apple = {
    id: number;
    name: string;
    taste: string;
}
type AppleInput = 
    Pick<Apple, 'name' | 'taste'>

// Resolver

const getApple = (args: { id: number }): Apple | undefined => 
        apples.find(apple => apple.id === args.id)

const getApples = (): Apple[] => apples;

const createApple = (args: { input: AppleInput}): Apple => {
    const apple = {
        id: apples.length + 1,
        ...args.input,
    }
    apples.push(apple);
    return apple;
}

const updateApple = (args: { apple: Apple  }): Apple => {
    const index = apples.findIndex(apple => apple.id === args.apple.id);
    const targetApple = apples[index];

    if (targetApple) apples[index] = args.apple

    return targetApple;


}

const root = {
    getApple,
    getApples,
    createApple,
    updateApple,
}
//------------------//

// Server

const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
)

const PORT = 4000;

app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);