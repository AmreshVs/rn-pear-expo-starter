const HRPCBuilder = require('hrpc')
const Hyperschema = require('hyperschema')

const SCHEMA_DIR = './src/spec/schema'
const HRPC_DIR = './src/spec/hrpc'

const schema = Hyperschema.from(SCHEMA_DIR)
const api = schema.namespace('api')

api.register({
  name: 'hello-world-request',
  fields: [],
})

api.register({
  name: 'hello-world-response',
  fields: [
    {
      name: 'value',
      type: 'string',
    },
  ],
})

Hyperschema.toDisk(schema)

const builder = HRPCBuilder.from(SCHEMA_DIR, HRPC_DIR)
const ns = builder.namespace('api')

ns.register({
  name: 'hello-world',
  request: { name: '@api/hello-world-request', stream: false },
  response: { name: '@api/hello-world-response', stream: false },
})

HRPCBuilder.toDisk(builder)
