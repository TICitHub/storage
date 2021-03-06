import { CanonicalEntity, ChangeEvent, ActionType } from './types'
import { v4 as uuidv4 } from "uuid"
import { CoreDdl } from '@navarik/core-ddl'

interface FactoryConfig {
  ddl: CoreDdl
}

export class ChangeEventFactory<M extends object> {
  private ddl: CoreDdl

  constructor({ ddl }: FactoryConfig) {
    this.ddl = ddl
  }

  create<B extends object>(action: ActionType, entity: CanonicalEntity<B, M>, commitMessage: string): ChangeEvent<B, M> {
    // If can't find this particular version of the schema, fallback to the latest version
    const schema = this.ddl.describe(entity.schema) || this.ddl.describe(entity.type)
    if (!schema) {
      throw new Error(`[Storage] Cannot find schema for ${entity.type} (schema version: ${entity.schema})`)
    }

    return {
      id: uuidv4(),
      action,
      user: entity.modified_by,
      message: commitMessage,
      entity: entity,
      schema: schema,
      parent: undefined,
      timestamp: entity.modified_at
    }
  }
}
