console.log("Oh hai! 🖤");

const color = document.getElementsByClassName('color');
const square = document.getElementsByClassName('square');
let selected = "white";
let rgb = "#FFFFFF"

function setActiveColor(e) {
  selected = e.target.id;
  rgb = e.target.dataset.rgb;
  console.log(rgb);
}
  
for (let item of color) {
  item.addEventListener("click", setActiveColor, false);   
}

function colorAndPublish(e, channel) {
  let pixel = e.target.id.replace('square', '');
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

  channel.subscribe(message => { 
    const data = message.data;
    
    if(data.constructor.name == "ArrayBuffer") { 
      console.log("Buffer!");
      const data = message.data.toString('utf-8');
      console.log(data);
    } else {
      console.log(message.data);
    }
    
  });
  
  channel.publish("tshirt", "C");
  
  console.log("Subscribed");
}

connect(); 