import admin from 'firebase-admin'
import firestorm from '../src'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'

const projectId = `emage-me-test-${Math.floor(Math.random() * 100000000)}`
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.GCLOUD_PROJECT = projectId

const initTest = (): void => {
  admin.initializeApp()
  const firestore = admin.firestore()
  firestore.settings({ timestampsInSnapshots: true, ignoreUndefinedProperties: true })
  firestorm.initialize(firestore)
}

initTest()

export const clear = async (): Promise<void> => {
  const testEnv = await initializeTestEnvironment({ projectId })
  await testEnv.clearFirestore()
}
