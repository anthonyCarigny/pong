import {Vector} from "./Vector";

class Rect {
  pos: Vector;
  size: Vector;
  vel: Vector;
  constructor(w=0, h=0){
    this.pos = new Vector();
    this.size = new Vector(w, h);
    this.vel = new Vector();
  }
  get left(){
    return this.pos.x
  }
  get right(){
    return this.pos.x + this.size.x
  }
  get top(){
    return this.pos.y
  }
  get bottom(){
    return this.pos.y + this.size.y
  }
  get height(){
    return this.bottom-this.top
  }
  get middle(){
    return (this.top+this.bottom)/2
  }
}

export { Rect };
