export declare class ID {
    private id;
    constructor();
    private generateID;
    generate(): number;
    match(id: number): boolean;
    get current(): number;
}
