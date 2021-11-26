import admin from 'firebase-admin'
import firestorm from '../src'

describe('Instance', () => {
  describe('collectionRef', () => {
    it('returns null', async () => {
      admin.initializeApp()
      const firestore = admin.firestore()
      firestorm.initialize(firestore)
      expect(firestorm.firestore).toBe(firestore)
    })
  })
})
