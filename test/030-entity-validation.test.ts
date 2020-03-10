import expect from 'expect.js'
import { Storage } from '../src'

const fixtureSchemata = require('./fixtures/schemata')

const storage = new Storage({
  schema: fixtureSchemata
})

const invalidData = {
  type: 'profile.user',
  body: {
    role: 100500,
    last_name: ["Lisa"],
    first_name: false,
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }
}

const validData = {
  type: 'profile.user',
  body: {
    role: "Doge",
    last_name: "Such",
    first_name: "Much",
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }
}

describe('Entity validation', () => {
  before(() => storage.up())
  after(() => storage.down())

  it("can recognize valid entities", async () => {
    const response = await storage.isValid(validData)
    expect(response).to.be.equal(true)
  })

  it("can recognize invalid entities", async () => {
    let response = await storage.isValid({ type: 'profile.user', body: {} })
    expect(response).to.be.equal(false)

    response = await storage.isValid(invalidData)
    expect(response).to.be.equal(false)
  })

  it("considers entities of unknown type invalid", async () => {
    let response = await storage.isValid({ type: 'wow.doge', body: {} })
    expect(response).to.be.equal(false)

    response = await storage.isValid({ type: 'wow.doge', body: invalidData.body })
    expect(response).to.be.equal(false)
  })

  it("can tell what is wrong with invalid entities", async () => {
    let response = await storage.validate(invalidData)
    expect(response.isValid).to.be(false)
    expect(response.message).to.be.equal('Invalid value provided for: role, last_name, first_name')

    response = await storage.validate({ type: 'wow.doge', body: invalidData.body })
    expect(response.isValid).to.be(false)
    expect(response.message).to.be.equal('Unknown schema: wow.doge')
  })
})