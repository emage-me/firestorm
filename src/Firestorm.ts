import { Firestore } from './types'

export class Firestorm {
  firestore: Firestore

  initialize (firestore: Firestore): void {
    this.firestore = firestore
  }
}
