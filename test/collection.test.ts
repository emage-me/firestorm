import { clear } from './test.helper'
import { Collection, field, date } from '../src'

interface Field {
  label: string
  obj: { count: number }
}

class Model extends Collection {
  static collectionName: string = 'model'
  @field() label: string
  @field(0) count: number
  @field() isEmpty: boolean
  @field({}) field: Field
  @date() creationDate: Date
}

describe('Firebase', () => {
  const modelProperties = { label: 'value', count: 1, creationDate: new Date(), isEmpty: false, field: {} }
  const modelData = { id: '0', ...modelProperties }
  let model: Model
  let otherModel: Model

  afterEach(async () => {
    await clear()
  })

  describe('constructor', () => {
    it('returns collection instance', async () => {
      model = new Model({})
      expect(model).toBeInstanceOf(Model)
    })
    it('init default value', async () => {
      model = new Model({})
      expect(model.count).toBe(0)
    })

    it('deep copy initial value', async () => {
      const otherModel = new Model({})
      otherModel.field.label = 'toto'
      model = new Model({})

      expect(model.field.label).toBe(undefined)
    })
  })

  describe('save', () => {
    it('creates model in firebase', async () => {
      model = new Model(modelData)
      await model.save()
      const dbModel = await Model.findOrFail(model.id)
      expect(dbModel).toStrictEqual(model)
    })
    describe('when already exits', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })
      it('updates model in firebase', async () => {
        model = new Model({ ...modelData, label: 'otherValue' })
        await model.save()
        const dbModel = await Model.findOrFail(model.id)
        expect(dbModel.label).toBe(model.label)
      })
    })
  })
  describe('set', () => {
    beforeEach(async () => {
      model = new Model(modelData)
      await model.save()
    })
    it('updates model in firebase', async () => {
      await model.set({ ...modelData, label: 'otherValue' })
      const dbModel = await Model.findOrFail(model.id)
      expect(dbModel.label).toBe('otherValue')
    })
    it('updates model in firebase', async () => {
      await model.set({ ...modelData, 'field.label': 'value' })
      const dbModel = await Model.findOrFail(model.id)
      expect(dbModel.field.label).toBe('value')
    })
  })
  describe('update', () => {
    beforeEach(async () => {
      model = new Model(modelData)
      await model.save()
    })
    it('updates model in firebase object by id', async () => {
      await model.update({ ...modelData, label: 'otherValue' })
      const dbModel = await Model.findOrFail(model.id)
      expect(dbModel.label).toBe('otherValue')
    })
    it('updates model in firebase array', async () => {
      await model.update({ ...modelData, label: 'otherValue' })
      const dbModel = await Model.firstOrFail()
      expect(dbModel.label).toBe('otherValue')
    })
    it('updates the instance', async () => {
      await model.update({ ...modelData, label: 'otherValue' })
      expect(model.label).toBe('otherValue')
    })
    it('updates only firebase field', async () => {
      await model.update({ ...modelData, otherLabel: 'otherValue' })
      // eslint-disable-next-line
      expect(model['otherLabel']).toBe(undefined)
    })
    it('updates model in firebase', async () => {
      await model.update({ 'field.obj.count': 1 })
      const dbModel = await Model.findOrFail(model.id)
      expect(dbModel.field.obj.count).toBe(1)
    })
    it('updates only firebase field', async () => {
      await model.update({ 'field.obj.count': 1 })
      expect(model.field.obj.count).toBe(1)
    })
  })
  describe('delete', () => {
    beforeEach(async () => {
      model = new Model(modelData)
      await model.save()
    })
    it('updates model in firebase', async () => {
      await model.delete()
      const dbModel = await Model.findAll()
      expect(dbModel.length).toBe(0)
    })
  })
  describe('first', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })

      it('returns instance of model', async () => {
        const dbModel = await Model.first()
        expect(dbModel).toBeInstanceOf(Model)
      })
      it('returns model properties', async () => {
        const dbModel = await Model.first()
        expect(dbModel).toStrictEqual(model)
      })
    })
    describe('without model existing', () => {
      it('returns undefined', async () => {
        const dbModel = await Model.first()
        expect(dbModel).toBe(undefined)
      })
    })
    describe('with empty date', () => {
      beforeEach(async () => {
        model = new Model({ ...modelData, creationDate: undefined })
        await model.save()
      })
      it('returns instance of model', async () => {
        const dbModel = await Model.find(model.id)
        expect(dbModel).toBeInstanceOf(Model)
      })
    })
  })
  describe('firstOrFail', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })

      it('returns instance of model', async () => {
        const dbModel = await Model.firstOrFail()
        expect(dbModel).toBeInstanceOf(Model)
      })
    })
    describe('without model existing', () => {
      it('throws an error', async () => {
        await expect(Model.firstOrFail()).rejects.toThrow('No instance found')
      })
      describe('with custom error message', () => {
        it('throws an custom error', async () => {
          await expect(Model.firstOrFail('Custom')).rejects.toThrow('Custom')
        })
      })
    })
  })
  describe('find', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })

      it('returns instance of model', async () => {
        const dbModel = await Model.find(model.id)
        expect(dbModel).toBeInstanceOf(Model)
      })
      it('returns model properties', async () => {
        const dbModel = await Model.find(model.id)
        expect(dbModel).toStrictEqual(model)
      })
    })
    describe('without model existing', () => {
      it('returns undefined', async () => {
        const dbModel = await Model.find(model.id)
        expect(dbModel).toBe(undefined)
      })
    })
    describe('with empty date', () => {
      beforeEach(async () => {
        model = new Model({ ...modelData, creationDate: undefined })
        await model.save()
      })
      it('returns instance of model', async () => {
        const dbModel = await Model.find(model.id)
        expect(dbModel).toBeInstanceOf(Model)
      })
    })
  })
  describe('findOrFail', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })

      it('returns instance of model', async () => {
        const dbModel = await Model.findOrFail(model.id)
        expect(dbModel).toBeInstanceOf(Model)
      })
      it('returns a js date', async () => {
        const dbModel = await Model.findOrFail(model.id)
        expect(dbModel.creationDate).toEqual(modelProperties.creationDate)
      })
    })
    describe('without model existing', () => {
      it('throws an error', async () => {
        await expect(Model.findOrFail(model.id)).rejects.toThrow('Id 0 Not found in model')
      })
      describe('with custom error message', () => {
        it('throws an custom error', async () => {
          await expect(Model.findOrFail(model.id, 'Custom')).rejects.toThrow('Custom')
        })
      })
    })
  })
  describe('findBy', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })
      it('returns instance of model', async () => {
        const dbModel = await Model.findBy('label', model.label)
        expect(dbModel).toBeInstanceOf(Model)
      })
      describe('on a number field', () => {
        it('returns instance of model', async () => {
          const dbModel = await Model.findBy('count', model.count)
          expect(dbModel).toBeInstanceOf(Model)
        })
      })
      describe('on a number field', () => {
        it('returns instance of model', async () => {
          const dbModel = await Model.findBy('isEmpty', model.isEmpty)
          expect(dbModel).toBeInstanceOf(Model)
        })
      })
      it('returns model properties', async () => {
        const dbModel = await Model.findBy('label', model.label)
        expect(dbModel).toStrictEqual(model)
      })
    })
    describe('without model existing', () => {
      it('returns undefined', async () => {
        const dbModel = await Model.findBy('label', model.label)
        expect(dbModel).toBe(undefined)
      })
    })
  })
  describe('findByOrFail', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelData)
        await model.save()
      })
      it('returns instance of model', async () => {
        const dbModel = await Model.findByOrFail('label', model.label)
        expect(dbModel).toBeInstanceOf(Model)
      })
    })
    describe('without model existing', () => {
      it('throws an error', async () => {
        await expect(Model.findByOrFail('label', model.label)).rejects.toThrow('No instance found')
      })
      describe('with custom error message', () => {
        it('throws an custom error', async () => {
          await expect(Model.findByOrFail('label', model.label, 'Custom')).rejects.toThrow('Custom')
        })
      })
    })
  })
  describe('findAll', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        otherModel = new Model(modelProperties)
        await Promise.all([
          model.save(),
          otherModel.save()
        ])
      })
      it('returns instance of model', async () => {
        const dbModels = await Model.findAll()
        expect(dbModels[0]).toBeInstanceOf(Model)
      })
      it('returns two models', async () => {
        const dbModels = await Model.findAll()
        expect(dbModels.length).toBe(2)
      })
    })
    describe('without model existing', () => {
      it('returns an empty array', async () => {
        const dbModels = await Model.findAll()
        expect(dbModels).toStrictEqual([])
      })
    })
  })
  describe('findAllBy', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        otherModel = new Model(modelProperties)
        await Promise.all([
          model.save(),
          otherModel.save()
        ])
      })
      it('returns instance of model', async () => {
        const dbModels = await Model.findAllBy('label', model.label)
        expect(dbModels[0]).toBeInstanceOf(Model)
      })
      it('returns two models', async () => {
        const dbModels = await Model.findAllBy('label', model.label)
        expect(dbModels.length).toBe(2)
      })
      it('returns two models', async () => {
        const dbModels = await Model.findAllBy('isEmpty', false)
        expect(dbModels.length).toBe(2)
      })
    })
    describe('without model existing', () => {
      it('returns an empty array', async () => {
        const dbModels = await Model.findAllBy('label', model.label)
        expect(dbModels).toStrictEqual([])
      })
    })
  })
  describe('findByIds', () => {
    describe('with model existing', () => {
      beforeEach(async () => {
        model = new Model(modelProperties)
        otherModel = new Model(modelProperties)
        await Promise.all([
          model.save(),
          otherModel.save()
        ])
      })
      it('returns instance of model', async () => {
        const dbModels = await Model.findByIds([model.id, otherModel.id])
        expect(dbModels[0]).toBeInstanceOf(Model)
      })
      it('returns two models', async () => {
        const dbModels = await Model.findByIds([model.id, otherModel.id])
        expect(dbModels.length).toBe(2)
      })
    })
    describe('without model existing', () => {
      it('returns an empty array', async () => {
        const dbModels = await Model.findByIds(['fakeId'])
        expect(dbModels).toStrictEqual([])
      })
    })
  })
})
