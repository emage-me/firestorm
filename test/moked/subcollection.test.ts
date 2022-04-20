import { clear } from './test.helper'
import { Collection, SubCollection, CollectionRepository, field, date, subCollection } from '../../src/moked'

class User extends SubCollection {
  static collectionName: string = 'user'
  @field() firstName: string
  @field() LastName: string
}

class Model extends Collection {
  static collectionName: string = 'model'
  @field() label: string
  @field() count: number
  @date() creationDate: Date
  @subCollection(User) users: () => CollectionRepository<typeof User>
}

describe('Firebase', () => {
  afterEach(async () => {
    await clear()
  })

  describe('subcollection', () => {
    let model: Model
    describe('without parent collection ID', () => {
      beforeEach(async () => {
        model = new Model({})
      })
      it('throw error', async () => {
        expect(() => model.users()).toThrow('SubCollection require parent collection ID')
      })
    })
    describe('with parent collection ID', () => {
      beforeEach(async () => {
        model = new Model({ id: '1' })
        await model.users().create({ id: '1', firstname: 'test' }).save()
      })
      describe('findOrFail', () => {
        it('returns a subcollection instance', async () => {
          const user = await model.users().findOrFail('1')
          expect(user).toBeInstanceOf(User)
        })
      })

      describe('create', () => {
        it('returns a subcollection instance', async () => {
          const user = model.users().create({ firstname: 'test' })
          expect(user).toBeInstanceOf(User)
        })
      })
    })
    describe('with parent collection ID set after parent creation', () => {
      beforeEach(async () => {
        model = new Model({})
        model.id = '1'
        await model.users().create({ id: '1', firstname: 'test' }).save()
      })
      describe('findOrFail', () => {
        it('returns a subcollection instance', async () => {
          const user = await model.users().findOrFail('1')
          expect(user).toBeInstanceOf(User)
        })
      })
    })
  })
})
