import { CollectionRepository } from './CollectionRepository'
import { Instance } from './Instance'
import firestorm from './'
import { FirestormQuery } from './Query'
import { CollectionReference } from './types'

export class Collection extends Instance {
  static query<T extends typeof Instance> (this: T): FirestormQuery<T> {
    return (new CollectionRepository<T>(this, null)).query
  }

  static collectionRef (): CollectionReference {
    if (firestorm.data[this.collectionName] === undefined) {
      firestorm.data[this.collectionName] = { data: [], dataById: [] }
    }
    return firestorm.data[this.collectionName]
  }

  collectionRef (): CollectionReference {
    if (firestorm.data[this.constructor.collectionName] === undefined) {
      firestorm.data[this.constructor.collectionName] = { data: [], dataById: [] }
    }
    return firestorm.data[this.constructor.collectionName]
  }

  // Collection repository method shortcut
  public static async first<T extends typeof Instance> (this: T): Promise<InstanceType<T>|undefined> { return await (new CollectionRepository<T>(this, null)).first() }
  public static async firstOrFail<T extends typeof Instance> (this: T, errorMessage?: string): Promise<InstanceType<T>> { return await (new CollectionRepository<T>(this, null)).firstOrFail(errorMessage) }
  public static async find<T extends typeof Instance> (this: T, id: string): Promise<InstanceType<T>|undefined> { return await (new CollectionRepository<T>(this, null)).find(id) }
  public static async findOrFail<T extends typeof Instance> (this: T, id: string, errorMessage?: string): Promise<InstanceType<T>> { return await (new CollectionRepository<T>(this, null)).findOrFail(id, errorMessage) }
  public static async findBy<T extends typeof Instance> (this: T, field: string, value: string): Promise<InstanceType<T>|undefined> { return await (new CollectionRepository<T>(this, null)).findBy(field, value) }
  public static async findByOrFail<T extends typeof Instance> (this: T, field: string, value: string, errorMessage?: string): Promise<InstanceType<T>> { return await (new CollectionRepository<T>(this, null)).findByOrFail(field, value, errorMessage) }
  public static async findAll<T extends typeof Instance> (this: T): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findAll() }
  public static async findAllBy<T extends typeof Instance> (this: T, field: string, value: string | boolean): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findAllBy(field, value) }
  public static async findByIds<T extends typeof Instance> (this: T, ids: string[]): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findByIds(ids) }
}
