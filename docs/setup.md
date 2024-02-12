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

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)