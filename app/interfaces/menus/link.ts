export interface ILink {
    title: string;
    url?: string;
    props?: {
        target?: '_blank';
    };
    hidden?: boolean;
}

export interface INestedLink extends ILink {
    children?: this[];
}
