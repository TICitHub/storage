import expect from 'expect.js'
import createStorage from '../src'
import fixturesEvents from './fixtures/data/events.json'
import fixtureSchemata from './fixtures/schemata/schemata.json'
import { expectEntity } from './steps/checks'
import { forAll, forNone } from './steps/generic'
import createSteps from './steps/entities'

const storage = createStorage({
  schema: fixtureSchemata
})

const invalidData = {
  role: 100500,
  last_name: ["Lisa"],
  first_name: false,
  company: "Alpha Oil Co",
  email: "lking@test.abc"
}

const validData = {
  role: "Doge",
  last_name: "Such",
  first_name: "Much",
  company: "Alpha Oil Co",
  email: "lking@test.abc"
}

describe("Entity validation", () => {
  before(() => storage.init())

  it("can recognize valid entities", async () => {
    const response = await storage.isValid('profile.user', validData)
    expect(response).to.be.equal(true)
  })

  it("can recognize invalid entities", async () => {
    const response = await storage.isValid('profile.user', invalidData)
    expect(response).to.be.equal(false)
  })

  it("can tell what is wrong with invalid entities", async () => {
    let response = await storage.validate('profile.user', invalidData)
    expect(response).to.be.equal('[Storage] Invalid value provided for: role, last_name, first_name')

    response = await storage.validate('wow.such.doge!', invalidData)
    expect(response).to.be.equal('[Storage] Unknown type: wow.such.doge!')
  })
})