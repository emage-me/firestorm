## Fetch data
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

### First
Get the first document
```javascript
const user = await User.first()
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

### FindByIds
Find many documents by id
```javascript
const users = await User.findByIds(['24','42'])
```

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)

