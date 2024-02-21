import { clear } from './test.helper'
import { Collection, array, field, Instance } from '../src'

class SubObject extends Instance {
  @field('test') field: string
  @field('') otherField: string

  get title (): string {
    return 'title'
  }
}

class Model extends Collection {
  static collectionName: string = 'model'
  @array(SubObject) subObjectArray: SubObject[]
}

describe('Firebase', () => {
  afterEach(async () => {
    await clear()
  })

  describe('object array', () => {
    describe('with empty subObjectArray', () => {
      it('returns an empty array', async () => {
        const model = new Model({})
        expect(model.subObjectArray).toEqual([])
      })
    })
    describe('with filled subObject', () => {
      it('returns a SubObject instance', async () => {
        const field = 'field'
        const otherField = 'otherField'
        const model = new Model({ subObjectArray: [{ field, otherField }] })
        expect(model.subObjectArray[0]).toBeInstanceOf(SubObject)
        expect(model.subObjectArray[0].field).toBe(field)
        expect(model.subObjectArray[0].otherField).toBe(otherField)
      })

      describe('with filled subObject', () => {
        it('save the SubObject', async () => {
          const field = 'field'
          const otherField = 'otherField'
          const model = await new Model({ subObjectArray: [{ field, otherField }] }).save()
          const dbModel = await Model.findOrFail(model.id)
          expect(dbModel.subObjectArray[0]).toBeInstanceOf(SubObject)
          expect(dbModel.subObjectArray[0].field).toBe(field)
          expect(dbModel.subObjectArray[0].otherField).toBe(otherField)
        })
      })
    })
  })
})
