import { Dictionary } from '@navarik/types'
import { AccessControlAdapter, CanonicalEntity, AccessControlDecision, UUID, AccessType } from '../../src/types'

interface Permissions {
  read?: boolean
  write?: boolean
  search?: boolean
}

export class PermissionsBasedAccessControl implements AccessControlAdapter<any> {
  private acl: Dictionary<Permissions> = {}

  private isGranted(subject: string, permission: AccessType) {
    const aclRecord = this.acl[subject] || {}
    return !!aclRecord[permission]
  }

  grant(subject: string, permission: AccessType) {
    this.acl[subject] = {
      ...this.acl[subject],
      [permission]: true
    }
  }

  revoke(subject: string, permission: AccessType) {
    this.acl[subject] = {
      ...this.acl[subject],
      [permission]: false
    }
  }

  async check(subject: UUID, action: AccessType, object: CanonicalEntity<any, any>): Promise<AccessControlDecision> {
    const granted = this.isGranted(subject, action)

    return {
      granted,
      explanation: `[PermissionsBasedAccessControl]: ${granted ? "Granted" : "Denied"} - "${subject}" => "${action}" => "${object && object.id}"`
    }
  }

  async attachTerms(entity: CanonicalEntity<any, any>): Promise<CanonicalEntity<any, any>> {
    return entity
  }

  async getQuery(subject: UUID, access: AccessType): Promise<Dictionary<any>> {
    if (this.isGranted(subject, access)) {
      return {}
    }

    // this is always false for the purpose of these tests so that the query yields nothing
    return { true: false }
  }
}
