import { Instance } from './Instance'
import { CollectionReference } from './types'

export class SubCollection extends Instance {
  parent: Instance

  collectionRef (): CollectionReference {
    return this.parent.docRef().collection(this.constructor.collectionName)
  }
}
