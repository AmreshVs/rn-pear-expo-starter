import { getRPC } from '../utils/rpc'

export interface HelloWorldResponse {
  value: string
}

export interface BackendError {
  error: string
  code?: string
}

export const backendApi = {
  helloWorld: async (): Promise<HelloWorldResponse> => {
    try {
      const rpc = getRPC()
      if (!rpc) throw new Error('RPC client not initialized')
      return await rpc.helloWorld()
    } catch (e) {
      console.error('API Error: helloWorld', e)
      throw e
    }
  },
}
