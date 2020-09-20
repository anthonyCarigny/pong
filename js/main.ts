import { Pong } from "./Pong";
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
