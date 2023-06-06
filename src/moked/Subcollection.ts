import { CollectionReference } from './types'
import { Instance } from './Instance'
import { Collection } from './Collection'
import { CollectionRepository } from './CollectionRepository'
import { FirestormQuery } from './Query'
import firestorm from './'

export class SubCollection extends Instance {
  parent: Collection

  collectionRef (): CollectionReference {
    return this.parent.subCollectionRef(this.constructor.collectionName)
  }

  collectionGroupRef (): CollectionReference {
    const collectionName = this.constructor.collectionName
    if (firestorm.data[collectionName] === undefined) {
      firestorm.data[collectionName] = { data: [], dataById: {}, id: collectionName }
    }
    return firestorm.data[collectionName]
  }

  static collectionRef (): CollectionReference {
    const collectionName = this.collectionName
    if (firestorm.data[collectionName] === undefined) {
      firestorm.data[collectionName] = { data: [], dataById: {}, id: collectionName }
    }
    return firestorm.data[collectionName]
  }

  static query<T extends typeof Instance> (this: T): FirestormQuery<T> {
    return (new CollectionRepository<T>(this, null)).query
  }

  public static async findByIds<T extends typeof Instance> (this: T, ids: string[]): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findByIds(ids) }
  public static async findAllBy<T extends typeof Instance> (this: T, field: string, value: string | boolean): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findAllBy(field, value) }
}
