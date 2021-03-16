
export class User {

  public nombre: string;
  public email: string;
  public uid: string;

  constructor( obj: DataObj) {
    this.nombre = obj && obj.nombre || null;
    this.email = obj && obj.email || null;
    this.uid = obj && obj.uid || null;
  }

}

export interface DataObj {
  email: string;
  nombre: string;
  uid: string;
}
