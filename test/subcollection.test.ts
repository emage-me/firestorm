import { clear } from './test.helper'
import { Collection, SubCollection, CollectionRepository, field, date, subCollection } from '../src'

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
    describe('with parent collection ID set after parent creation', () => {
      beforeEach(async () => {
        await Model.collectionRef().doc('1').collection('user').doc('1').set({ firstname: 'test' })
        model = new Model({})
        model.id = '1'
      })
      describe('findOrFail', () => {
        it('returns a subcollection instance', async () => {
          const user = await model.users().findOrFail('1')
          expect(user).toBeInstanceOf(User)
        })
      })
    })

    describe('findAllBy', () => {
      describe('with same firstName', () => {
        let firstName: string

        beforeEach(async () => {
          model = new Model({ id: '1' })
          const otherModel = new Model({ id: '2' })
          firstName = 'GRADU'
          const user = model.users().create({ id: '1', firstName, LastName: 'jean' })
          const otherUser = model.users().create({ id: '2', firstName, LastName: 'paul' })
          await Promise.all([
            model.save(),
            otherModel.save(),
            user.save(),
            otherUser.save()
          ])
        })
        it('returns all users', async () => {
          const user = await User.findAllBy('firstName', firstName)
          expect(user.length).toBe(2)
        })
        it('set user parent id', async () => {
          const user = await User.findAllBy('LastName', 'jean')
          expect(user[0].parent.id).toBe('1')
        })
      })
    })
    describe('query', () => {
      describe('where', () => {
        let firstName: string

        beforeEach(async () => {
          firstName = 'GRADU'
          model = new Model({ id: '1' })
          const user = model.users().create({ id: '1', firstName, LastName: 'jean' })
          await Promise.all([
            model.save(),
            user.save()
          ])
        })
        it('returns the user', async () => {
          const user = await User.query().where('firstName', '==', firstName).get()
          expect(user.length).toBe(1)
        })
      })
    })
  })
})
