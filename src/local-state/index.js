import objectPath from 'object-path'
import SearchIndex from './search-index'
import createIndexAdapter from './index-adapter-factory'

class LocalState {
  constructor(indexAdapter, idField, trackVersions) {
    this.versions = {}
    this.idField = idField
    this.trackVersions = trackVersions
    this.searchIndex = new SearchIndex(createIndexAdapter(indexAdapter), this.idField)
  }

  async exists(key) {
    const document = await this.get(key)
    return !!document
  }

  async set(item) {
    const key = objectPath.get(item, this.idField)

    if (this.trackVersions) {
      if (!this.versions[key]) {
        this.versions[key] = []
      }

      this.versions[key].push(item)
    }

    await this.searchIndex.add(item)
  }

  async get(key, version) {
    if (version && this.trackVersions === false) {
      throw new Error('[Storage] Local State is running without version tracking.')
    }

    // convert to searchIndex idField from document idField
    const idFieldSearchIndex = this.idField.replace('body.', '')
    const documents = await this.find({ [idFieldSearchIndex]: key })
    const latest = documents.length ? documents[0] : undefined

    return version
      ? this.versions[key][version - 1]
      : latest
  }

  async getAll() {
    return this.find()
  }

  async reset() {
    this.versions = {}
    await this.searchIndex.reset()
  }

  isConnected() {
    return this.searchIndex.isConnected()
  }

  async find(query, options) {
    const found = await this.searchIndex.find(query, options)
    const collection = found.map(x => x.___document)

    return collection
  }

  async findContent(text, options) {
    const found = await this.searchIndex.findContent(text, options)
    const collection = found.map(x => x.___document)

    return collection
  }

  async count(query) {
    return this.searchIndex.count(query)
  }
}

export default LocalState
