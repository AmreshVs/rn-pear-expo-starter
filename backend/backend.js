/* global BareKit */
const FramedStream = require('framed-stream')

const HRPC = require('../spec/hrpc')

const rpc = new HRPC(new FramedStream(BareKit.IPC))

rpc.onHelloWorld((req) => {
  try {
    console.log('Request from frontend: ', req)
    return {
      value: 'Hello!, response from backend',
    }
  } catch (error) {
    console.error('Backend RPC Error [helloWorld]:', error)
    return {
      error: error.message || 'Unknown backend error',
    }
  }
})
