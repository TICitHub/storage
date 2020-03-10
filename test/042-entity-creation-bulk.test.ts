import expect from 'expect.js'
import { Storage } from '../src'
import { EntitySteps } from './steps/entities'

const fixturesEvents = require('./fixtures/data/events')
const fixtureSchemata = require('./fixtures/schemata')

const storage = new Storage({
  schema: fixtureSchemata
})

const steps = new EntitySteps(storage)

describe('Bulk entity creation', () => {
  before(() => storage.up())
  after(() => storage.down())

  it("correctly creates collection of new entities", async () => {
    await steps.canCreateCollection(fixturesEvents)
  })

  it("can find created entities", async () => {
    await Promise.all(fixturesEvents.map(x => steps.canFind(x)))
  })

  it("correct number of entities is created", async () => {
    const response = await storage.find()
    expect(response).to.be.an('array')
    expect(response).to.have.length(fixturesEvents.length)
  })
})