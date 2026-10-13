import http from 'http'
import { Firestore } from './types'

export class Firestorm {
  firestore: Firestore
  data: {}

  constructor () {
    this.data = {}
  }

  initialize (firestore: Firestore): void {
    this.firestore = firestore
  }

  // Deletes every document. Only available against the Firestore emulator (or in mocked mode)
  async reset (): Promise<void> {
    const host = process.env.FIRESTORE_EMULATOR_HOST
    if (host === undefined || host === '') throw new Error('firestorm.reset() requires the Firestore emulator (FIRESTORE_EMULATOR_HOST)')

    const projectId = (this.firestore as unknown as { projectId: string }).projectId
    const path = `/emulator/v1/projects/${projectId}/databases/(default)/documents`
    await new Promise<void>((resolve, reject) => {
      const request = http.request(`http://${host}${path}`, { method: 'DELETE' }, response => {
        response.resume()
        if (response.statusCode === 200) resolve()
        else reject(new Error(`firestorm.reset() failed with status ${String(response.statusCode)}`))
      })
      request.on('error', reject)
      request.end()
    })
  }
}

export default new Firestorm()
