# Setup

## Installation
set `"experimentalDecorators": true'` in `tsconfig.json`
```shell
yarn add @emage-me/firestorm

```

## Initialisation
```javascript
import admin from 'firebase-admin'
import firestorm from '@emage-me/firestorm'

admin.initializeApp()
const firestore = admin.firestore()
firestorm.initialize(firestore)
```

# Collection
## Collection définition
The collection use `@field` decorator for each fields stored in firebase
```javascript
import { Collection, field } from '@emage-me/firestorm'

class User extends Collection {
  static collectionName: string = 'user'
  @field() firstName: string
  @field() lastName: string
  fullName: string

  get fullName() {
    return `${firstName} ${lastName.toUpperCase()}`    
  }
}
```
## Add data

### Constructor
```javascript
const userData = {
  id: '42',
  firstName: 'Jack'
}
const user = new User(userData)
user.lastName = 'barrow'

console.log(user.fullName) // Jack BARROW
```

### Save
```javascript
const user = new User({firstName: 'Jack'})
const userWithId = await user.save()
// Id was genrated by firebase if not provided
```

### Set
```javascript
await user.set({firstName: 'toto'})
console.log(user.fullName) // toto 
```

### Update
```javascript
await user.update({firstName: 'toto'})
console.log(user.fullName) // toto BARROW
```

## Fetch data

### First
Get the first document
```javascript
const user = await User.first()
```
### Find
Find by document ID
```javascript
const user = await User.find('42')
```
### FindBy
Find by attribute and return the first found
```javascript
const user = await User.findBy('firstName','Jack')
```
### OrFail version
It throws an exeception instead of returns undefiend
```javascript
await User.firstOrFail()
await User.findOrFail('42')
await User.findByOrFail('firstName','Jack')
```

### FindAll
Find all documents in a collection
```javascript
const users = await User.findAll()
```

### FindAllBy
Find all documents with an attribute
```javascript
const users = await User.findAllBy('firstName','Jack')
```

### findByIds
Find many documents by id
```javascript
const users = await User.findByIds(['24','42'])
```


## Query data
### First
Get first item
```javascript
await User.query().first().get()
```
### FirstOrFail
Get first item or fail
```javascript
await User.query().firstOrFail().get()
```
### Where
```javascript
await User.query().where('firstName','==','jack').get()
```

### Orderby
```javascript
await User.query().orderby('order','asc').get()
```

### Limit
```javascript
await User.query().limit(3).get()
```

### Multiple operation
Querry operation can be chained
```javascript
await User.query
  .where('firstName','==','jack')
  .where('lastName','==','Barrow')
  .orderby('order','asc')
  .limit(3)
  .get()
```

# Subcollection

## Subcollection définition
```javascript
import { Collection, Subcollection, CollectionRepository, field, subCollection } from '@emage-me/firestorm'

class User extends SubCollection {
  static collectionName: string = 'user'
  @field() firstName: string
  @field() LastName: string
}

class App extends Collection {
  static collectionName: string = 'app'
  @field() name: string
  @subCollection(User) users: () => CollectionRepository<typeof User>
}
```

## Constructor
```javascript
const app = new App({id:'24'})

const user = await app.users.create({ id:1, fullName: 'jack' })

```

## Fetch data
All collection methods are available

### First
Get the first document
```javascript
const user = await app.users.first()
```
### Find
Find by document ID
```javascript
const user = await app.users.find('42')
```
### FindBy
Find by attribute and return the first found
```javascript
const user = await app.users.findBy('firstName','Jack')
```
### OrFail version
Throw an exeception instead of return undefiend
```javascript
await app.users.firstOrFail()
await app.users.findOrFail('42')
await app.users.findByOrFail('firstName','Jack')
```

### FindAll
Find all documents in a collection
```javascript
const users = await app.users.findAll()
```

### FindAllBy
Find all documents with an attribute
```javascript
const users = await app.users.findAllBy('firstName','Jack')
```

### findByIds
Find many documents by id
```javascript
const users = await app.users.findByIds(['24','42'])
```

## Query data
### First
Get first item
```javascript
await app.users.query().first().get()
```
### FirstOrFail
Get first item or fail
```javascript
await app.users.query().firstOrFail().get()
```
### Where
```javascript
await app.users.query().where('firstName','==','jack').get()
```

### Orderby
```javascript
await app.users.query().orderby('order','asc').get()
```

### Limit
```javascript
await app.users.query().limit(3).get()
```

### Querry operation can be chained
```javascript
await app.users.query
  .where('firstName','==','jack')
  .where('lastName','==','Barrow')
  .orderby('order','asc')
  .limit(3)
  .get()
```

# Decorators
Decorators are used to describe firebase field type.
attributes without `@field` or `@date` are not save in firebase

## Field
```javascript
@field() firstName: string
```

## Date
Used to retrive a JS Date Object instead of a firebaseTimestamp
```javascript
@date() birthDate: date
```

## SubCollection
Used to add a subCollection 
```javascript
@subCollection(User) users: () => CollectionRepository<typeof User>
```