import { CollectionReference } from './types'
import { Instance } from './Instance'
import { Collection } from './Collection'

export class SubCollection extends Instance {
  parent: Collection

  collectionRef (): CollectionReference {
    return this.parent.subCollectionRef(this.constructor.collectionName)
  }
}
