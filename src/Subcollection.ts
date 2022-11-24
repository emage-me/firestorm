import { CollectionRepository } from './CollectionRepository'
import firestorm from './'
import { Instance } from './Instance'
import { FirestormQuery } from './Query'
import { CollectionGroup, CollectionReference } from './types'

export class SubCollection extends Instance {
  parent: Instance

  collectionRef (): CollectionReference {
    return this.parent.docRef().collection(this.constructor.collectionName)
  }

  static collectionRef (): CollectionGroup {
    return firestorm.firestore.collectionGroup(this.collectionName)
  }

  static query<T extends typeof Instance> (this: T): FirestormQuery<T> {
    return (new CollectionRepository<T>(this, null)).query
  }

  public static async findAllBy<T extends typeof Instance> (this: T, field: string, value: string | boolean): Promise<Array<InstanceType<T>>> { return await (new CollectionRepository<T>(this, null)).findAllBy(field, value) }
}
