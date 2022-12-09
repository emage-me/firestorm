import { clear } from './test.helper'
import { FieldPath } from '@google-cloud/firestore'
import { Collection, field } from '../src'

class Model extends Collection {
  static collectionName: string = 'model'
  @field() label: string
  @field() count: number
  @field() obj: {values: string[], count: number}
}

describe('Firestorm query', () => {
  let model: Model
  let otherModel: Model
  let modelProperties: Object

  beforeEach(async () => {
    modelProperties = { label: 'value', count: 1 }
    model = new Model(modelProperties)
    otherModel = new Model(modelProperties)
  })

  afterEach(async () => {
    await clear()
  })
  describe('first', () => {
    describe('with a model in firebase', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        await model.save()
      })
      it('returns the first model found', async () => {
        const dbModel = await Model.query().first()
        expect(dbModel).toStrictEqual(model)
      })
    })
    describe('without instance in database', () => {
      it('returns undefined', async () => {
        const dbModel = await Model.query().first()
        expect(dbModel).toBeUndefined()
      })
    })
  })
  describe('firstOrFail', () => {
    describe('with a model in firebase', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        await model.save()
      })
      it('returns the first model found', async () => {
        const dbModel = await Model.query().firstOrFail()
        expect(dbModel).toStrictEqual(model)
      })
    })
    describe('without instance in database', () => {
      it('throws an error', async () => {
        await expect(Model.query().firstOrFail()).rejects.toThrow('No instance found')
      })
      describe('with custom error message', () => {
        it('throws an custom error', async () => {
          await expect(Model.query().firstOrFail('Custom')).rejects.toThrow('Custom')
        })
      })
    })
  })
  describe('where', () => {
    describe('with a model in firebase', () => {
      beforeEach(async () => {
        model = new Model({ ...modelProperties, obj: { values: ['value'], count: 1 } })
        await model.save()
      })
      describe('with == operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('label', '==', 'value').get()
          expect(dbModels[0]).toStrictEqual(model)
        })
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '==', 1).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with >= operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '>=', 0).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '>=', 0).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with <= operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '<=', 2).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '<=', 2).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with array-contains operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.values', 'array-contains', 'value').get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with many where', () => {
        it('found one model', async () => {
          const dbModels = await Model.query()
            .where('label', '==', 'value')
            .where('count', '==', 1)
            .get()
          expect(dbModels.length).toStrictEqual(1)
        })
      })

      describe('without firebase corespondance', () => {
        it('returns an empty array', async () => {
          const dbModels = await Model.query().where('label', '==', 'value2').get()
          expect(dbModels.length).toBe(0)
        })
      })
    })
  })
  describe('orderBy', () => {
    let orderByDirection: string
    let fieldPath: string

    beforeEach(async () => {
      fieldPath = 'count'
      model = new Model(modelProperties)
      otherModel = new Model({ ...modelProperties, count: 2 })
      await Promise.all([
        model.save(),
        otherModel.save()
      ])
    })
    describe('with desc direction', () => {
      beforeEach(async () => {
        orderByDirection = 'desc'
      })
      it('return ordered models', async () => {
        const dbModel = await Model.query().orderBy(fieldPath, orderByDirection).firstOrFail()
        expect(dbModel.count).toBe(2)
      })
    })
    describe('with asc direction', () => {
      beforeEach(async () => {
        orderByDirection = 'asc'
      })
      it('return ordered models', async () => {
        const dbModel = await Model.query().orderBy(fieldPath, orderByDirection).firstOrFail()
        expect(dbModel.count).toBe(1)
      })
    })
  })
  describe('limit', () => {
    beforeEach(async () => {
      model = new Model(modelProperties)
      otherModel = new Model({ ...modelProperties, count: 2 })
      await Promise.all([
        model.save(),
        otherModel.save()
      ])
    })
    it('returns model', async () => {
      const dbModel = await Model.query().limit(1).get()
      expect(dbModel.length).toBe(1)
    })
  })
  describe('paginate', () => {
    beforeEach(async () => {
      model = new Model(modelProperties)
      otherModel = new Model({ ...modelProperties, id: '0', count: 2 })
      await Promise.all([
        model.save(),
        otherModel.save()
      ])
    })
    it('returns model', async () => {
      const dbModel = await Model.query().orderBy(FieldPath.documentId(), 'asc').paginate(1, otherModel.id).get()
      expect(dbModel[0].id).toBe(otherModel.id)
    })
  })
  describe('filters', () => {
    beforeEach(async () => {
      model = new Model(modelProperties)
      otherModel = new Model({ ...modelProperties, count: 2 })
      await Promise.all([
        model.save(),
        otherModel.save()
      ])
    })
    it('found one  model', async () => {
      const filters = [
        ['label', '==', 'value'],
        ['count', '==', 1]
      ]
      const dbModels = await Model.query().filters(filters).get()
      expect(dbModels.length).toStrictEqual(1)
    })
  })
})
