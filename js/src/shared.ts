export enum NodeStatus {
    nomal,
    low,
    high,
    abnormal
}
export enum LinkStatus {
    nomal,
    low,
    high,
    abnormal
}
export enum NodeType {
    lowEnd,
    midEnd,
    highEnd
}

export interface Point {
    x: number;
    y: number;
}

export interface Node {
    name: string;
    id: string;
    x: Point;
    y: Point;
    status: NodeStatus;
    type: NodeType;
}
export interface Link {
    id: number;
    name: string;
    src: LinkTarget;
    dest: LinkTarget
}
export interface LinkTarget {
    id: number;
    x: number;
    y: number;
}