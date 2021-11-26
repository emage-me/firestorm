import { Collection, SubCollection, CollectionRepository } from '../src'
import { field, date, subCollection, getFields, getDates, getSubcollections } from '../src/decorators'
import { Instance } from '../src/Instance'

class User extends SubCollection {
  static collectionName: string = 'user'
  @field firstName: string
  @field LastName: string
}

class ModelWithSubcollection extends Collection {
  static collectionName: string = 'modelWuthSubcollection'
  @field label: string
  @field count: number
  @date creationDate: Date
  @subCollection(User) users: () => CollectionRepository<typeof Instance>
}

class Model extends Collection {
  static collectionName: string = 'model'
  @field otherLabel: string
  @field otherCount: number
}

describe('Firestorm decorators', () => {
  it('creates corectly firebaseKeys for collection', async () => {
    const keys = getFields(Model.prototype)
    expect(keys).toStrictEqual(['otherLabel', 'otherCount'])
  })

  it('creates corectly firebaseKeys for collection with subcollection', async () => {
    const keys = getFields(ModelWithSubcollection.prototype)
    expect(keys).toStrictEqual(['label', 'count', 'creationDate'])
  })

  it('creates corectly dateKeys for collection with date', async () => {
    const keys = getDates(ModelWithSubcollection.prototype)
    expect(keys).toStrictEqual(['creationDate'])
  })

  it('creates corectly firebaseKeys for subcollection', async () => {
    const keys = getFields(User.prototype)
    expect(keys).toStrictEqual(['firstName', 'LastName'])
  })

  it('creates corectly subCollections', async () => {
    expect(getSubcollections(ModelWithSubcollection.prototype)).toStrictEqual([['users', User]])
  })
})
