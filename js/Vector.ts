class Vector {
  x: number;
  y: number;

  constructor(x=0, y=0){
    this.x=x;
    this.y=y;
    this.len = Math.sqrt(this.x**2+ this.y**2);
  }

  get len(){
    return Math.sqrt(this.x**2+ this.y**2);
  }
  set len(value){
    const fact = value/this.len;
    this.x *= fact;
    this.y *= fact;
  }
}
export { Vector };
