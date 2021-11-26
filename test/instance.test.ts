import { Instance } from '../src/Instance'

describe('Instance', () => {
  describe('collectionRef', () => {
    it('returns null', async () => {
      const instance = new Instance({})
      expect(instance.collectionRef()).toBe(null)
    })
  })
})
