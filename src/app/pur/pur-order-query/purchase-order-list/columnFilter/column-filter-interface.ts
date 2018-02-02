export interface IRule {
    nodeType?: string;
    condition?: string;
    rules?: IRule[];
    key?: string;
    field?: string;
    value?: any;
    value2?;
    operator?: string;
    not?: boolean;
    parent?: IRule;
}
export interface RuleSet extends IRule {

}

export interface Rule extends IRule {

}

export interface Option {
    name: string;
    value: any;
}

export interface Field {
    key?: string;
    name: string;
    type: string;
    nullable?: boolean;
    options?: Option[];
}