import expect from 'expect.js'
import { Storage } from '../src'
import { expectEntity } from './steps/checks'
import { createSteps } from './steps/entities'

const fixtureSchemata = require('./fixtures/schemata')
const fixtures = require('./fixtures/data/versions.json')

const storage = new Storage({
  schema: fixtureSchemata
})

const { cannotUpdate, canUpdate } = createSteps(storage)

let id

describe('Entity versioning, index type', () => {
  before(async () => {
    await storage.up()
    const entity = await storage.create('profile.user', fixtures[0])
    id = entity.id
  })
  after(() => storage.down())

  it("can't update nonexistent entity", cannotUpdate('wow-such-much-doge', { a: 100, b: 500 }))

  fixtures.slice(1).forEach((fixture, version) =>
    it(`correctly updates entity to version ${version + 2}`, () => canUpdate(id, fixture)())
  )

  const lastVersion = fixtures[fixtures.length - 1]
  it('only the latest version is directly available', async () => {
    let response

    response = await storage.get(id)
    expectEntity(response)
    expect(response.body).to.eql(lastVersion)

    response = await storage.find(lastVersion)
    expect(response).to.be.an('array')
    expect(response).to.have.length(1)
    expectEntity(response[0])
    expect(response[0].body).to.eql(lastVersion)
  })

  // it('all versions are available individually', forAll(fixtures, (fixture, index) => async () => {
  //   const response = await storage.get(id, index + 1)
  //   expectEntity(response)
  //   expect(response.body).to.eql(fixture)
  // }))
})
