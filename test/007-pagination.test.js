import expect from 'expect.js'
import createStorage from '../src'
import fixtureSchemata from './fixtures/schemata/schemata.json'
import fixturesEvents from './fixtures/data/events.json'
import fixturesJobs from './fixtures/data/job-orders.json'
import fixturesUsers from './fixtures/data/users.json'
import fixturesMessages from './fixtures/data/messages.json'
import { expectEntity } from './steps/checks'
import { forAll, forNone } from './steps/generic'
import createSteps from './steps/entities'
import generateConfig from './config/adapter-list'


const run = config => {
  const storage = createStorage({
    schema: fixtureSchemata,
    data: {
      'timelog.timelog_event': fixturesEvents,
      'document.job_order': fixturesJobs,
      'profile.user': fixturesUsers,
      'chat.text_message': fixturesMessages
    },
    ...config,
  })

  describe(`Search pagination, index type [${config.index.description || config.index}]`, () => {
    before(() => storage.init())
    after(() => {
      if (config.index.cleanup) {
        return config.index.cleanup()
      }
    })

    it("can limit the search results", async () => {
      let response = await storage.find({ sender: '1', job_order: '13' }, { limit: 2 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)

      response = await storage.find({ sender: 1, job_order: 13 }, { limit: 10 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(5)
      response.forEach(expectEntity)
    })

    it("limit 0 is not applied", async () => {
      const response = await storage.find({ sender: '1', job_order: '13' }, { limit: 0 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(5)
      response.forEach(expectEntity)
    })

    it("limit 0 is not applied (with offset)", async () => {
      const response = await storage.find({ sender: '1', job_order: '13' }, { limit: 0, offset: 3 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)
    })

    it("invalid offset and limit are not applied", async () => {
      let response = await storage.find({ sender: '1', job_order: '13'}, { limit: 'invalidOffset', offset: 'ff0000'})
      expect(response).to.be.an('array')
      expect(response).to.have.length(5)
      response.forEach(expectEntity)
    })

    it("can offset the search results", async () => {
      let response = await storage.find({ sender: '1', job_order: '13' }, { limit: 2, offset: 2 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)

      response = await storage.find({ sender: '1', job_order: '13' }, { limit: 2, offset: 4 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(1)
      response.forEach(expectEntity)

      response = await storage.find({ sender: '1', job_order: '13' }, { limit: 2, offset: 0 })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)
    })

    it("can offset and limit with sort", async () => {
      let response = await storage.find({ sender: '1', job_order: '13'}, { limit: 2, offset: 2, sort: ['timestamp:asc'] })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)
    })

    it("can offset and limit with numeric string as input", async () => {
      // test with string limit and offset, which is a common case when these parameters are retrieved from request query params.
      let response = await storage.find({ sender: '1', job_order: '13'}, { limit: '2', offset: '2', sort: ['timestamp:asc'] })
      expect(response).to.be.an('array')
      expect(response).to.have.length(2)
      response.forEach(expectEntity)
    })
  })
}

generateConfig().forEach(c => run(c))
