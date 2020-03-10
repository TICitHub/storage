import expect from 'expect.js'
import { Storage } from '../src'

const fixtureSchemata = require('./fixtures/schemata')
const fixturesEvents = require('./fixtures/data/events.json')
const fixturesJobs = require('./fixtures/data/job-orders.json')

const storage = new Storage({
  schema: fixtureSchemata
})

describe('Observing changes', () => {
  before(() => storage.up())
  after(() => storage.down())

  it("can observe entity changes", async () => {
    const results = []
    storage.observe((x) => { results.push(x) })

    for (const entity of fixturesJobs) {
      await storage.create(entity)
    }

    expect(results).to.be.an('array')
    expect(results).to.have.length(fixturesJobs.length)

    for (const entity of fixturesEvents) {
      await storage.create(entity)
    }

    expect(results).to.be.an('array')
    expect(results).to.have.length(fixturesJobs.length + fixturesEvents.length)
  })
})