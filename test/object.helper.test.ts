import { objectAssign } from '../src/object.helper'

describe('objectAssign', () => {
  let target
  let source
  describe('with empty target', () => {
    beforeEach(async () => {
      target = {}
      source = { 'sub.field': 'value', field: 'v' }
    })
    it('assign field value', async () => {
      objectAssign(target, source)
      expect(target.field).toBe('v')
    })
    it('convert dot notation in object', async () => {
      objectAssign(target, source)
      expect(target.sub.field).toBe('value')
    })
  })
  describe('with other sub field', () => {
    beforeEach(async () => {
      target = { sub: { otherField: 'otherValue' } }
      source = { 'sub.field': 'value' }
    })
    it('keep otherField', async () => {
      objectAssign(target, source)
      expect(target.sub.otherField).toBe('otherValue')
    })
  })
})
