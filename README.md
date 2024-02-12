# FireODM
The best way for build object oriented code backend with Firestore

FireODM is an Typescript ODM for Google Firestore database, it use the activeRecord patern
It was only working with firebase-admin for backend

- [Setup](./docs/setup.md)
- Data structure : [Collection](./docs/collection.md) | [SubCollection](./docs/subCollection.md) | [SubObject](./docs/subObject.md)

- Data manipulation : [CRUD](./CRUD.md) | [Fetch](./docs/fetch.md) | [Queries](./docs/query.md)
- [API references](./docs/api.md)

## Main features
- Use Objects
- Full Typescript
- In memory mockup for easy testing

## Example

### Find a document ID
```javascript
const user = await User.find('42')
```

### Create a new document
```javascript
const user = new User({ firstName: 'Jack'})
await user.save()
```

### Make a query
```javascript
await User.query()
  .where('lastName','==','jack')
  .orderBy('age','asc')
  .limit(2)
  .get()
```

### Define a collection
```javascript
class User extends Collection {
  static collectionName: string = 'user'
  @field('') firstName: string
  @field('') lastName: string
}
```

### Use in memory mockup
```javascript
// no firebase emulator needed
process.env.FIRESTORM_MOCKED = 'true'

// clear all in memory data
firestorm.data = {}
```