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

  async reset (): Promise<void> {
    this.data = {}
  }
}

export default new Firestorm()
