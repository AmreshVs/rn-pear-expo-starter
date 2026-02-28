const FramedStream = require('framed-stream')
const { Worklet } = require('react-native-bare-kit')

const HRPC = require('../spec/hrpc')

const { setRPC } = require('./rpc')

export async function startWorklet(storagePath: string) {
  const worklet = new Worklet()
  worklet.start('app:/main.bundle', require('../backend/backend.bundle'), [storagePath])

  const rpc = new HRPC(new FramedStream(worklet.IPC))
  setRPC(rpc)

  return { worklet, rpc }
}
