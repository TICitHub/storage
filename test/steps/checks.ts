import { expect } from "chai"
import { CanonicalEntity } from '../../src'

export const expectEntity = (given: Partial<CanonicalEntity<any, any>>|undefined) => {
  expect(given).to.be.an('object')
  if (!given) {
    throw new Error('No entity given')
  }
  expect(given).to.have.keys(['body', 'meta', 'type', 'id', 'version_id', 'modified_at', 'modified_by', "parent_id", "schema"])
  expect(given.body).to.be.an('object')
  expect(given.meta).to.be.an('object')
  expect(given.type).to.be.a('string')
  expect(given.schema).to.be.a('string')
  expect(given.id).to.be.a('string')
  expect(given.version_id).to.be.a('string')
}

export const expectSameEntity = (given: Partial<CanonicalEntity<any, any>>|undefined, expected: Partial<CanonicalEntity<any, any>>|undefined) => {
  expectEntity(given)
  if (!given || !expected) {
    throw new Error('No entity given')
  }

  if (expected.type) {
    expect(given.type).to.eql(expected.type)
  }
  if (expected.id) {
    expect(given.id).to.eql(expected.id)
  }

  for (const field in expected.body) {
    expect(given.body[field]).to.eq(expected.body[field])
  }
}
