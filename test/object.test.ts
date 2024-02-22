import { clear } from './test.helper'
import { Collection, object, field, Instance } from '../src'

class SubObject extends Instance {
  @field('test') field: string
  @field('') otherField: string

  get title (): string {
    return 'title'
  }
}

class Model extends Collection {
  static collectionName: string = 'model'
  @object(SubObject) subObject: SubObject
}

describe('Firebase', () => {
  afterEach(async () => {
    await clear()
  })

  describe('object', () => {
    describe('with empty subObject', () => {
      it('returns a SubObject instance', async () => {
        const model = new Model({})
        expect(model.subObject).toBeInstanceOf(SubObject)
        expect(model.subObject.field).toBe('test')
        expect(model.subObject.title).toBe('title')
      })
    })
    describe('with filled subObject', () => {
      it('returns a SubObject instance', async () => {
        const field = 'field'
        const otherField = 'otherField'
        const model = new Model({ subObject: { field, otherField } })
        expect(model.subObject).toBeInstanceOf(SubObject)
        expect(model.subObject.field).toBe(field)
        expect(model.subObject.otherField).toBe(otherField)
      })
      describe('save', () => {
        it('save the SubObject', async () => {
          const field = 'field'
          const otherField = 'otherField'
          const model = await new Model({ subObject: { field, otherField } }).save()
          const dbModel = await Model.findOrFail(model.id)
          expect(dbModel.subObject).toBeInstanceOf(SubObject)
          expect(dbModel.subObject.field).toBe(field)
          expect(dbModel.subObject.otherField).toBe(otherField)
        })
      })
      describe('update', () => {
        let model: Model
        beforeEach(async () => {
          const field = 'field'
          model = await new Model({ subObject: { field } }).save()
        })
        describe('with plain object', () => {
          let payload: any
          const field = 'field2'
          beforeEach(async () => {
            payload = { subObject: { field } }
          })
          it('update the SubObject', async () => {
            await model.update(payload)
            const dbModel = await Model.findOrFail(model.id)
            expect(dbModel.subObject.field).toBe(field)
          })
        })
        describe('with object', () => {
          let payload: any
          const field = 'field2'
          beforeEach(async () => {
            model.subObject.field = field
            payload = { subObject: model.subObject }
          })
          it('update the SubObject', async () => {
            await model.update(payload)
            const dbModel = await Model.findOrFail(model.id)
            expect(dbModel.subObject.field).toBe(field)
          })
        })
      })
    })
  })
})
