import { clear } from './test.helper'
import { Collection, date } from '../src'

const defaultDate = new Date()

class Model extends Collection {
  static collectionName: string = 'model'
  @date(defaultDate) creationDate: Date
}

describe('Firebase', () => {
  afterEach(async () => {
    await clear()
  })

  describe('date', () => {
    describe('with empty date in db', () => {
      beforeEach(async () => {
        await Model.collectionRef().doc('1').set({})
      })
      it('returns defaultDate', async () => {
        const model = await Model.findOrFail('1')
        expect(model.creationDate).toBe(defaultDate)
      })
    })
  })
})
