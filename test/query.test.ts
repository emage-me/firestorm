import { clear } from './test.helper'
import { Collection } from '../src'
import { field } from '../src/decorators'

class Model extends Collection {
  static collectionName: string = 'model'
  @field label: string
  @field count: number
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
        expect(dbModel?.toFirestore()).toStrictEqual(modelProperties)
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
        expect(dbModel.toFirestore()).toStrictEqual(modelProperties)
      })
    })
    describe('without instance in database', () => {
      it('throws an error', async () => {
        await expect(Model.query().firstOrFail()).rejects.toThrow('No instance found')
      })
    })
  })
  describe('where', () => {
    describe('with a model in firebase', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        await model.save()
      })
      it('returns the model found', async () => {
        const dbModels = await Model.query().where('label', '==', 'value').get()
        expect(dbModels[0].toFirestore()).toStrictEqual(modelProperties)
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
      await model.save()
      await otherModel.save()
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
      await model.save()
      await otherModel.save()
    })
    it('return ordered models', async () => {
      const dbModel = await Model.query().limit(1).get()
      expect(dbModel.length).toBe(1)
    })
  })
})
