import { clear } from './test.helper'
import { Collection, date, Instance, object, array } from '../src'

const defaultDate = new Date()

class SubObjectWithDate extends Instance {
  @date(defaultDate) updatedAt: string
}

class Model extends Collection {
  static collectionName: string = 'model'
  @date(defaultDate) creationDate: Date
  @object(SubObjectWithDate) subObject: SubObjectWithDate
  @array(SubObjectWithDate) subObjects: SubObjectWithDate[]
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
    describe('in a sub object', () => {
      it('returns defaultDate', async () => {
        const model = new Model({})
        expect(model.subObject.updatedAt).toBeInstanceOf(Date)
      })
      describe('with sub object in db', () => {
        beforeEach(async () => {
          await new Model({}).save()
        })
        it('returns defaultDate', async () => {
          const dbModel = await Model.firstOrFail()
          expect(dbModel.subObject.updatedAt).toBeInstanceOf(Date)
        })
      })
    })
    describe('in a array of sub object', () => {
      it('returns defaultDate', async () => {
        const model = new Model({ subObjects: [{}] })
        expect(model.subObjects[0].updatedAt).toBeInstanceOf(Date)
      })
      describe('with array of sub object in db', () => {
        beforeEach(async () => {
          await new Model({ subObjects: [{}] }).save()
        })
        it('returns defaultDate', async () => {
          const dbModel = await Model.firstOrFail()
          expect(dbModel.subObjects[0].updatedAt).toBeInstanceOf(Date)
        })
      })
    })
  })
})
