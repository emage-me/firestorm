import { Firestore } from '../types'

export class Firestorm {
  firestore: Firestore
  data: {}

  constructor () {
    this.data = {}
  }

  initialize (firestore: Firestore): void {
    this.firestore = firestore
  }
}

export default new Firestorm()
