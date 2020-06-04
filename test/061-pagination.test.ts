import { expect } from "chai"
import { Storage, CanonicalSchema, CanonicalEntity } from '../src'
import { expectEntity } from './steps/checks'
import { nullLogger } from "./fixtures/null-logger"

const fixtureSchemata: Array<CanonicalSchema> = require('./fixtures/schemata')
const fixturesEvents: Array<CanonicalEntity<any, any>> = require('./fixtures/data/events.json')
const fixturesJobs: Array<CanonicalEntity<any, any>> = require('./fixtures/data/job-orders.json')
const fixturesUsers: Array<CanonicalEntity<any, any>> = require('./fixtures/data/users.json')
const fixturesMessages: Array<CanonicalEntity<any, any>> = require('./fixtures/data/messages.json')

const fixtureData = [
  ...fixturesEvents,
  ...fixturesJobs,
  ...fixturesUsers,
  ...fixturesMessages
]

const storage = new Storage({
  schema: fixtureSchemata,
  data: fixtureData,
  logger: nullLogger
})

describe('Search pagination', () => {
  before(() => storage.up())
  after(() => storage.down())

  it("can limit the search results", async () => {
    let response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 2 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(2)
    response.forEach(expectEntity)
  })

  it("limit 0 is not applied", async () => {
    const response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 0 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(5)
    response.forEach(expectEntity)
  })

  it("limit 0 is not applied (with offset)", async () => {
    const response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 0, offset: 3 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(2)
    response.forEach(expectEntity)
  })

  it("can offset the search results", async () => {
    let response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 2, offset: 2 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(2)
    response.forEach(expectEntity)

    response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 2, offset: 4 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(1)
    response.forEach(expectEntity)

    response = await storage.find({ 'body.sender': '1', 'body.job_order': '13' }, { limit: 2, offset: 0 })
    expect(response).to.be.an('array')
    expect(response).to.have.length(2)
    response.forEach(expectEntity)
  })

  it("can offset and limit with sort", async () => {
    let response = await storage.find({ 'body.sender': '1', 'body.job_order': '13'}, { limit: 2, offset: 2, sort: ['timestamp:asc'] })
    expect(response).to.be.an('array')
    expect(response).to.have.length(2)
    response.forEach(expectEntity)
  })
})
