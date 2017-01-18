enum NodeStatus {
    nomal,
    low,
    high,
    abnormal
}
enum LinkStatus {
    nomal,
    low,
    high,
    abnormal
}
enum NodeType {
    lowEnd,
    midEnd,
    highEnd
}

interface Point {
    x: number;
    y: number;
}

interface Node {
    name: string;
    id: string;
    x: Point;
    y: Point;
    status: NodeStatus;
    type: NodeType;
}
interface Link {
    id: number;
    name: string;
    src: LinkTarget;
    dest: LinkTarget
}
interface LinkTarget {
    id: number;
    x: number;
    y: number;
}