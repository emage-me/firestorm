import { CollectionReference } from './types'
import { Instance } from './Instance'

export class SubCollection extends Instance {
  parent: Instance

  collectionRef (): CollectionReference {
    if (this.parent.collectionRef()[this.parent.id] === undefined) this.parent.collectionRef()[this.parent.id] = {}
    if (this.parent.collectionRef()[this.parent.id][this.constructor.collectionName] === undefined) {
      this.parent.collectionRef()[this.parent.id][this.constructor.collectionName] = { data: [], dataById: [] }
    }
    return this.parent.collectionRef()[this.parent.id][this.constructor.collectionName]
  }
}
