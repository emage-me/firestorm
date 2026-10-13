# Setup

## Installation
set `"experimentalDecorators": true'` in `tsconfig.json`
```shell
yarn add @emage-me/firestorm

npm install @emage-me/firestorm
```

## Initialisation
```javascript
import admin from 'firebase-admin'
import firestorm from '@emage-me/firestorm'

admin.initializeApp()
const firestore = admin.firestore()
firestorm.initialize(firestore)
```

## Tests
Set `FIRESTORM_MOCKED=true` before the first firestorm import to use the in-memory implementation (no Firestore emulator needed).

`firestorm.reset()` deletes every document: it clears the in-memory data in mocked mode, or the Firestore emulator (`FIRESTORE_EMULATOR_HOST`) otherwise.
```javascript
afterEach(async () => {
  await firestorm.reset()
})
```

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)