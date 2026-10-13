## [0.16.0] 13-10-2026
### added
- `firestorm.reset()` to delete every document (mocked data or Firestore emulator)
- `startAtId` / `startAfterId` query cursors from a document id
- mocked version: `<`, `>`, `not-in` and `array-contains-any` operators, `FieldPath.documentId()` filters
- mocked version: `arrayUnion`, `arrayRemove`, `delete` and `serverTimestamp` field values
### fixed
- mocked version: date equality in `==`, `!=`, `in` and `not-in`
- mocked version: `orderBy` on strings, nested fields and several fields, documents without the ordered field excluded
- mocked version: stored data is isolated from instances (deep copy on write and read)
- mocked version: queries returned stale data after a second `save`
- mocked version: `delete` could remove the wrong collection group document
- mocked version: `parent` id restored on collection group queries
- mocked version: `update` throws `NOT_FOUND` on a missing document
- mocked version: `@date(x)` default value replaced by `new Date()`, like the real version

## [0.15.2] 07-02-2025
### fixed
- @date in subObject and array of subObject
- get only field define in collection from firebase

## [0.15.1] 27-01-2025
### fixed
- in operator for mocked version

## [0.15.0] 15-03-2024
### added
- default value on null value

## [0.14.1] 22-02-2024
### fixed
- sub object & sub object array update

## [0.14.0] 21-02-2024
### added
- sub object array

## [0.13.0] 08-02-2024
### added
- sub object
### changed
- improve documentation

## [0.12.0] 08-02-2024
### added
- improve error

## [0.11.0] 06-06-2023
### added
- findByIds for subcollections

## [0.10.3] 24-02-2023
### fixed
- findByIds with empty array

## [0.10.2] 06-01-2023
### fixed
- default value référence

## [0.10.0] 16-12-2022
### added
- count on query

## [0.8.0] 13-07-2022
### added
- dot notation support for update

## [0.7.0] 06-16-2022
### added
- static subcollection query

## [0.6.0] 06-14-2022
### added
- static subcollection findAllBy
### fixed
- findBy on number or boolean

## [0.5.0] 02-23-2022
### added
- findByIds

## [0.4.2] 09-22-2022
### fixed
- Default date value

## [0.4.0] 09-22-2022
### fixed
- Subcollection accessor
### added
- Default date value

## [0.3.0]
### added
- Instance delete
- Error customisation on OrFail