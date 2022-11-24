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
    describe('with empty date', () => {
      it('returns defaultDate', async () => {
        const model = new Model({})
        expect(model.creationDate).toBeInstanceOf(Date)
      })
    })
  })
})
