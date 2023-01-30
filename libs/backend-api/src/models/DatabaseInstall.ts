/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DatabaseInstall = {
    id: string;
    providerName: string;
    server?: string | null;
    name?: string | null;
    username?: string | null;
    password?: string | null;
    useIntegratedAuthentication?: boolean;
    connectionString?: string | null;
};
