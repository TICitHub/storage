import * as uuidv5 from 'uuid/v5'
import { SignatureProvider, IdGenerator } from '../types'

export class UuidSignatureProvider implements SignatureProvider {
  private generateId: IdGenerator

  constructor(generator: IdGenerator) {
    this.generateId = generator
  }

  signNew(type, body) {
    const id = this.generateId(body)
    const version_id = uuidv5(JSON.stringify(body), id)
    const now = new Date()

    const document = {
      id,
      version_id,
      version: 1,
      created_at: now.toISOString(),
      modified_at: now.toISOString(),
      type,
      body
    }

    return document
  }

  signVersion(type, body, previous) {
    const id = previous.id
    const version_id = uuidv5(JSON.stringify(body), id)
    const now = new Date()

    const document = {
      id,
      version_id,
      version: previous.version + 1,
      created_at: previous.created_at,
      modified_at: now.toISOString(),
      type,
      body
    }

    return document
  }
}
