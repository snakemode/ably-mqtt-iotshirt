 console.log("Oh hai! 🖤");

let color = document.getElementsByClassName('color');
let square = document.getElementsByClassName('square');
let selected = "white";
let pixel = 0;
let rgb = "0,0,0"

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
  channel.publish("tshirt", pixel + rgb);
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