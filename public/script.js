 console.log("Oh hai! 🖤");

let color = document.getElementsByClassName('color');
let square = document.getElementsByClassName('square');
let selected = "white";
let pixel = 0;
let rgb = "0,0,0"

for(let i = 0; i < color.length; i++) {
  color[i].addEventListener("click", function(e){
    selected = e.target.id;
    rgb = e.target.dataset.rgb;
    console.log(rgb);
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
  
  for (let sq of square) {
    sq.addEventListener("click", e => colorAndPublish(e, channel), false);   
  }

  channel.subscribe(message => console.log(message.data));
  console.log("Subscribed");
}

connect(); 