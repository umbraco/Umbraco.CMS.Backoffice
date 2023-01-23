/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DatabaseSettings = {
    id?: string;
    sortOrder?: number;
    displayName?: string;
    defaultDatabaseName?: string;
    providerName?: string;
    isConfigured?: boolean;
    requiresServer?: boolean;
    serverPlaceholder?: string;
    requiresCredentials?: boolean;
    supportsIntegratedAuthentication?: boolean;
    requiresConnectionTest?: boolean;
};

