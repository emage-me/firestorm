import { Instance } from '../../src/moked/Instance'

describe('Instance', () => {
  describe('collectionRef', () => {
    it('returns null', async () => {
      const instance = new Instance({})
      expect(instance.collectionRef()).toStrictEqual({ data: [], dataById: {} })
    })
  })
})
