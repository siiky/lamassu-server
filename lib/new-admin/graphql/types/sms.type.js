const { gql } = require('apollo-server-express')

const typeDef = gql`
  type CustomMessage {
    id: ID!
    event: CustomMessageEvent!
    message: String!
  }

  enum CustomMessageEvent {
    smsCode
    cashOutDispenseReady
  }

  type Query {
    customMessages: [CustomMessage] @auth
  }

  type Mutation {
    createCustomMessage(event: CustomMessageEvent!, message: String!): CustomMessage @auth
    editCustomMessage(id: ID!, event: CustomMessageEvent!, message: String!): CustomMessage @auth
    deleteCustomMessage(id: ID!): CustomMessage @auth
  }
`

module.exports = typeDef
