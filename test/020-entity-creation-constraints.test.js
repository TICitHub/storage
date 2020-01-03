import { Storage } from '../src'
import * as fixtureSchemata from './fixtures/schemata'
import { createSteps } from './steps/entities'

const storage = new Storage({
  schema: fixtureSchemata
})

const { canCreate, cannotCreate } = createSteps(storage)

describe('Entity format and constraints', () => {
  before(() => storage.init())

  it("can't create entity of unknown type", cannotCreate('wow.doge', {}))
  it("can't create malformed entity", cannotCreate('profile.user', {
    role: 100500,
    last_name: ["Lisa"],
    first_name: false,
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }))

  it("can create properly structured entity", canCreate('profile.user', {
    role: "Doge",
    last_name: "Such",
    first_name: "Much",
    company: "Alpha Oil Co",
    email: "lking@test.abc"
  }))
})
