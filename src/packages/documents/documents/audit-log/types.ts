import type { UmbAuditLogModel } from '@umbraco-cms/backoffice/audit-log';
import type { UmbDocumentAuditLogType } from './utils/index.js';

export interface UmbDocumentAuditLogModel extends UmbAuditLogModel<UmbDocumentAuditLogType> {}
