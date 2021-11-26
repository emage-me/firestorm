import { clear } from './test.helper'
import { Collection, SubCollection, CollectionRepository } from '../src'
import { field, date, subCollection } from '../src/decorators'

class User extends SubCollection {
  static collectionName: string = 'user'
  @field firstName: string
  @field LastName: string
}

class Model extends Collection {
  static collectionName: string = 'model'
  @field label: string
  @field count: number
  @date creationDate: Date
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
        await Model.collectionRef().doc('1').collection('user').doc('1').set({ firstname: 'test' })
        model = new Model({ id: '1' })
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

      describe('collectionRef', () => {
        it('returns a subcollection instance', async () => {
          const user = await model.users().create({ firstname: 'test' })
          expect(user.collectionRef().id).toBe('user')
        })
      })
    })
  })
})
