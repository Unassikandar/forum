const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('../graphql/schema/index');
const graphQLResolvers = require('../graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

// server
app.use(express.static('./src/client', {root: "."}));
app.use(express.static('build/contracts'));

app.get('/', (req, res) => {
    res.sendFile(`./src/client/index.html`, {root: "."});
  });
 
  app.get('*', (req, res) => {
    res.status(404);
    res.send('Ooops... this URL does not exist');
  });
 
  app.listen(8000, () => {
    console.log(`Listening on :8000...`);
  });

// connect to the mongoDB database
mongoose
    .connect(
        `mongodb+srv://unassikandar:D9vONiEmuO0ijbhK@cluster0-3zksz.mongodb.net/test?retryWrites=true&w=majority`
    ).then(() => {
        app.listen(8080);
    }).catch(err => {
        console.log(err);
    });

