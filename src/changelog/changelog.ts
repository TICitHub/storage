import { ChangelogAdapter, SignatureProvider, TransactionManager, Observer, Entity, CanonicalEntity } from '../types'

type ChangelogConfig = {
  adapter: ChangelogAdapter<CanonicalEntity>
  signatureProvider: SignatureProvider
  transactionManager: TransactionManager
}

export class ChangeLog {
  private adapter: ChangelogAdapter<CanonicalEntity>
  private signatureProvider: SignatureProvider
  private transactionManager: TransactionManager
  private observer: Observer<CanonicalEntity>|null

  constructor({ adapter, signatureProvider, transactionManager }: ChangelogConfig) {
    this.adapter = adapter
    this.signatureProvider = signatureProvider
    this.transactionManager = transactionManager
    this.observer = null

    this.adapter.observe(async (record) => {
      if (this.observer) {
        await this.observer(record)
      }

      this.transactionManager.commit(record.version_id, record)
    })
  }

  onChange(observer: Observer<CanonicalEntity>) {
    this.observer = observer
  }

  isConnected() {
    return this.adapter.isConnected()
  }

  reconstruct(topics: Array<string>) {
    return this.adapter.init(topics)
  }

  async registerNew(entity: Entity) {
    const firstVersion = this.signatureProvider.signNew(entity)
    const transaction = this.transactionManager.start(firstVersion.version_id)
    await this.adapter.write(firstVersion)

    return transaction.promise
  }

  async registerUpdate(entity: CanonicalEntity) {
    const newVersion = this.signatureProvider.signVersion(entity)
    if (entity.version_id === newVersion.version_id) {
      return entity
    }

    const transaction = this.transactionManager.start(newVersion.version_id)
    await this.adapter.write(newVersion)

    return transaction.promise
  }
}
