/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntityTreeItemResponseModel } from './EntityTreeItemResponseModel';

export type FolderTreeItemResponseModel = (EntityTreeItemResponseModel & {
    $type: string;
    isFolder?: boolean;
});

