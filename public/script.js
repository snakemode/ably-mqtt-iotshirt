 console.log("Oh hai! 🖤");

let color = document.getElementsByClassName('color');
let square = document.getElementsByClassName('square');
let selected = "white";
let pixel = 0;
let rgb = "#FFFFFF"

function setActiveColor(e) {
  selected = e.target.id;
  rgb = e.target.dataset.rgb;
  console.log(rgb);
}
  
for (let item of color) {
  item.addEventListener("click", function(e){
    setActiveColor(e);
  }, false);   
}

function colorAndPublish(e, channel) {
  pixel = e.target.id.replace('square', '');
  e.target.style.fill = selected;
  
  const pixelNumber = parseInt(pixel);
  const snakeId = getSnakeId(pixelNumber);
  
  channel.publish("tshirt", snakeId + rgb);  
}
       
// 🐍
function getSnakeId(pixelNumber) {
  const y = Math.floor(pixel / 16);
  const shouldSnake = y % 2 == 0;
  const lineOffset = y * 16;
  
  const regularX = (pixel % 16);
  const snakeX = (15 - regularX);
  
  const x = shouldSnake ? snakeX : regularX;
  const snakePixelId = x + (lineOffset);
  
  console.log(snakePixelId); 
  return snakePixelId;
}

async function connect() {
  const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
  const channelId = "tshirt";
  const channel = await ably.channels.get(channelId);
  await channel.attach();
  
  for (let cell of square) {
    cell.addEventListener("click", e => colorAndPublish(e, channel), false);   
  }

  channel.subscribe(message => console.log(message.data));
  console.log("Subscribed");
}

connect(); 