class Vec {
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

class Rect {
  constructor(w=0, h=0){
    this.pos = new Vec();
    this.size = new Vec(w, h);
    this.vel = new Vec();
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

class Ball extends Rect {
  constructor(){
    super(10, 10);
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100);
    this.score = 0;
  }
}

class Pong{
  constructor(canvas) {
    console.log(canvas)
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;

    this.players = [new Player(), new Player()]
    this.players[0].pos.x = 40 - this.players[0].size.x;
    this.players[1].pos.x = this._canvas.width - 40;
    const canvas_center = this._canvas.height / 2 ;
    this.players.forEach((player, index) => {
      console.log(canvas_center)
      console.log(player.size.y)
      player.pos.y = (canvas_center - player.size.y/2);
      console.log("player%s: pos=%s, vel=%s)",index,player.pos.y, player.vel.y)
      console.log(player)
    })

    console.log(this.ball);

    let lastTime;
    const callback = (milliseconds) => {
      if(lastTime){
        this.update((milliseconds-lastTime)/1000);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    }
    callback();

    this.CHAR_PIXEL_SIZE = 10;
    this.CHARS =
      ['111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111'].map(str => {
        const canvas = document.createElement('canvas');
        canvas.height = this.CHAR_PIXEL_SIZE * 5;
        canvas.width = this.CHAR_PIXEL_SIZE * 3;
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        str.split('').forEach((fill,i)=>{
          if(fill === '1') {
            context.fillRect( (i % 3) * this.CHAR_PIXEL_SIZE, (i/3 | 0) * this.CHAR_PIXEL_SIZE, this.CHAR_PIXEL_SIZE, this.CHAR_PIXEL_SIZE)
          }
        });
        return canvas;
    });
    this.reset();
  }
  drawScore(){
      const align = this._canvas.width/3;
      const CHAR_W = this.CHAR_PIXEL_SIZE * 4;
      this.players.forEach((player, index) => {
        const chars = player.score.toString().split('');
        const offset = align *
          (index+1) -
          (CHAR_W*chars.length/2) +
          (this.CHAR_PIXEL_SIZE/2);
        chars.forEach((char, pos) => {
          this._context.drawImage(this.CHARS[char|0],offset + pos * CHAR_W, 20);
        })
      })
  }
  drawRect(rect) {
    this._context.fillStyle = 'red';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);

  }

  moveComputer(){
    this.players[1].vel.y = (this.ball.pos.y > this.players[1].middle ? 450 : -450);
  }
  bounceBallIfCollidesWithPlayer(player){
    if(player.left <= this.ball.right && player.right >= this.ball.left && player.top <= this.ball.bottom && player.bottom >= this.ball.top ){
      this.ball.vel.x = -this.ball.vel.x;
      this.ball.vel.len *= 1.05;
      this.players[1].vel.y *= 3;
      console.log(this.ball.vel)
    }
  }

  draw(){
    this._context.fillStyle = '#000';
    this._context.fillRect(0,0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player))
    this.drawScore();
  }

  reset(){
    this.ball.pos.x = this._canvas.width/2;
    this.ball.pos.y = this._canvas.height/2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;

    this.players[1].vel.y = 0;
  }

  start() {
    if(this.ball.vel.x === 0 && this.ball.vel.y === 0){

      this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
      this.ball.vel.y = 300 * (Math.random() > 0.5 ? 1 : -1);
    }
  }


  update(delta_time){
    this.ball.pos.x+=this.ball.vel.x * delta_time;
    this.ball.pos.y+=this.ball.vel.y * delta_time;
    this.players[1].pos.y+=this.players[1].vel.y * delta_time;

    if(this.ball.left <= 0 || this.ball.right >= this._canvas.width){
      const playerId = this.ball.vel.x < 0 ? 1 : 0; //if the ball was going left when hitting the wall, player 1 won otherwise, player 0 won
      this.players[playerId].score++;
      this.reset();
    }
    if(this.ball.top <= 0 || this.ball.bottom >= this._canvas.height){
      this.ball.vel.y = -this.ball.vel.y;
    }

    this.moveComputer();
    this.players.forEach(player=>{
      this.bounceBallIfCollidesWithPlayer(player);
    })
    this.draw();
  }
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);


canvas.addEventListener('mousemove', event =>{
  pong.players[0].pos.y = event.offsetY;
})
canvas.addEventListener('touchmove', event =>{
  pong.players[0].pos.y = event.touches[0].clientY;
})
canvas.addEventListener('click', () =>{
  pong.start();
})

