import { clear } from './test.helper'
import { FieldPath } from '@google-cloud/firestore'
import { Collection, field, date } from '../src'

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
      describe('with != operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('label', '!=', 'badValue').get()
          expect(dbModels[0]).toStrictEqual(model)
        })
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.count', '!=', 0).get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with >= operation', () => {
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
      })
      describe('with array-contains operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('obj.values', 'array-contains', 'value').get()
          expect(dbModels[0]).toStrictEqual(model)
        })
      })
      describe('with in operation', () => {
        it('returns the model found', async () => {
          const dbModels = await Model.query().where('label', 'in', ['value']).get()
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
  describe('count', () => {
    beforeEach(async () => {
      model = new Model(modelProperties)
      otherModel = new Model(modelProperties)
      await Promise.all([
        model.save(),
        otherModel.save()
      ])
    })
    it('returns 2', async () => {
      const count = await Model.query().count()
      expect(count).toStrictEqual(2)
    })
  })
})

class DatedModel extends Collection {
  static collectionName: string = 'datedModel'
  @field() label: string
  @field() rank: number
  @field() tags: string[]
  @date() eventDate: Date
}

describe('Firestorm query operators', () => {
  let first: DatedModel
  let second: DatedModel
  let third: DatedModel

  beforeEach(async () => {
    first = new DatedModel({ id: 'a', label: 'alpha', rank: 1, tags: ['red'], eventDate: new Date('2026-01-01') })
    second = new DatedModel({ id: 'b', label: 'beta', rank: 2, tags: ['blue'], eventDate: new Date('2026-02-01') })
    third = new DatedModel({ id: 'c', label: 'gamma', rank: 2, tags: ['green'] })
    await Promise.all([first.save(), second.save(), third.save()])
  })

  afterEach(async () => {
    await clear()
  })

  const ids = (models: DatedModel[]): string[] => models.map(model => model.id).sort()

  it('filters with < operation', async () => {
    expect(ids(await DatedModel.query().where('rank', '<', 2).get())).toStrictEqual(['a'])
  })
  it('filters with > operation', async () => {
    expect(ids(await DatedModel.query().where('rank', '>', 1).get())).toStrictEqual(['b', 'c'])
  })
  it('filters with not-in operation', async () => {
    expect(ids(await DatedModel.query().where('label', 'not-in', ['alpha', 'beta']).get())).toStrictEqual(['c'])
  })
  it('filters with array-contains-any operation', async () => {
    expect(ids(await DatedModel.query().where('tags', 'array-contains-any', ['red', 'green']).get())).toStrictEqual(['a', 'c'])
  })
  it('filters dates with == operation', async () => {
    expect(ids(await DatedModel.query().where('eventDate', '==', new Date('2026-02-01')).get())).toStrictEqual(['b'])
  })
  it('filters dates with in operation', async () => {
    expect(ids(await DatedModel.query().where('eventDate', 'in', [new Date('2026-01-01')]).get())).toStrictEqual(['a'])
  })
  it('excludes documents without the field with != operation', async () => {
    expect(ids(await DatedModel.query().where('eventDate', '!=', new Date('2026-01-01')).get())).toStrictEqual(['b'])
  })
  it('filters on document id with FieldPath.documentId()', async () => {
    expect(ids(await DatedModel.query().where(FieldPath.documentId() as unknown as string, 'in', ['a', 'c']).get())).toStrictEqual(['a', 'c'])
  })

  describe('orderBy', () => {
    it('orders strings', async () => {
      const models = await DatedModel.query().orderBy('label', 'desc').get()
      expect(models.map(model => model.id)).toStrictEqual(['c', 'b', 'a'])
    })
    it('orders by several fields', async () => {
      const models = await DatedModel.query().orderBy('rank', 'desc').orderBy('label', 'asc').get()
      expect(models.map(model => model.id)).toStrictEqual(['b', 'c', 'a'])
    })
    it('excludes documents without the ordered field', async () => {
      const models = await DatedModel.query().orderBy('eventDate', 'asc').get()
      expect(models.map(model => model.id)).toStrictEqual(['a', 'b'])
    })
    it('applies the limit after ordering', async () => {
      const models = await DatedModel.query().limit(1).orderBy('label', 'desc').get()
      expect(models.map(model => model.id)).toStrictEqual(['c'])
    })
  })

  describe('startAtId', () => {
    it('starts at the document', async () => {
      const models = await DatedModel.query().orderBy('label', 'asc').startAtId('b').get()
      expect(models.map(model => model.id)).toStrictEqual(['b', 'c'])
    })
    it('positions on a document filtered out of the results', async () => {
      const models = await DatedModel.query().where('rank', '==', 2).orderBy('label', 'asc').startAtId('a').get()
      expect(models.map(model => model.id)).toStrictEqual(['b', 'c'])
    })
    it('counts from the document', async () => {
      expect(await DatedModel.query().orderBy('label', 'asc').startAtId('b').count()).toBe(2)
    })
    it('throws with an unknown document', async () => {
      await expect(DatedModel.query().orderBy('label', 'asc').startAtId('unknown').get()).rejects.toThrow()
    })
  })

  describe('startAfterId', () => {
    it('starts after the document', async () => {
      const models = await DatedModel.query().orderBy('label', 'asc').startAfterId('b').get()
      expect(models.map(model => model.id)).toStrictEqual(['c'])
    })
  })
})
