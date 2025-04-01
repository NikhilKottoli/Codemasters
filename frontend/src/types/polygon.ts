export type PolygonProblemType = {
    id: number;
    owner: string;
    name: string;
    deleted: boolean;
    favourite: boolean;
    accessType: string;
    revision: number;
    latestPackage?: number;
    modified: boolean;
};