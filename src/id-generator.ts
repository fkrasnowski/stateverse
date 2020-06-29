const idGenenrator = () => {
  let id: number = 0;
  return () => {
    if (id > 20000) id = 0;
    return id++;
  };
};

export class ID {
  private id: number = 0;
  constructor() {
    this.generateID = idGenenrator();
  }
  private generateID: () => number;
  generate() {
    this.id = this.generateID();
    return this.id;
  }
  match(id: number) {
    return id === this.id;
  }
  get current() {
    return this.id;
  }
}
