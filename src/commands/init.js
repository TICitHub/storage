const initCommand = (schemaChangeLog, entityChangeLog, schemaState, entityState, schemaRegistry, observer) => {
  const init = async () => {
    schemaRegistry.reset()
    schemaState.reset()
    entityState.reset()

    schemaChangeLog.onChange(async (schema) => {
      schemaRegistry.register(schema.body)
      await schemaState.set(schema)

      return schema
    })

    entityChangeLog.onChange(async (entity) => {
      observer.emit(entity)
      await entityState.set(entity)

      return entity
    })

    await schemaChangeLog.reconstruct(['schema'])
    const types = schemaRegistry.listUserTypes()
    await entityChangeLog.reconstruct(types)
  }

  return init
}

export default initCommand