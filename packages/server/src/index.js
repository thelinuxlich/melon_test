// @ts-check
import { createServer, createPubSub } from '@graphql-yoga/node'
import RedisStreamHelper from 'redis-stream-helper'

const pubSub = createPubSub()

const {
  addStreamData,
  addListener,
  client,
  createStreamGroup,
  listenForMessages,
} = RedisStreamHelper()

await client.set('global_currency', 0)

addListener('addCurrency')

await createStreamGroup('addCurrency')

const server = createServer({
  schema: {
    typeDefs: `
      type Query {
        currency: Int!
      }
      type Mutation {
        addCurrency(value: Int!): Int
      }
      type Subscription {
        currency: Int!
      }
    `,
    resolvers: {
      Query: {
        currency: async () => {
          const value = await client.get('global_currency')
          return value !== null ? +value : 0
        },
      },
      Mutation: {
        /**
         * @param {Request} _
         * @param {{value: number}} args
         */
        addCurrency: async (_, { value }) => {
          await addStreamData('addCurrency', { value })
          return value
        },
      },
      Subscription: {
        currency: {
          subscribe: () => pubSub.subscribe('currency'),
          resolve: payload => payload,
        },
      },
    },
  },
})
await server.start()

const run = async () => {
  await listenForMessages(
    async (
      /** @type {string} key */
      key,
      /** @type {string} streamId */
      streamId,
      /** @type {{value: number}} data */
      data
    ) => {
      if (key === 'addCurrency') {
        /** @type {number} */
        const value = await client.incrby('global_currency', data.value)
        pubSub.publish('currency', value)
      }
    }
  )
  await run()
}

run()
