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

function processSyncMessage(message) {
  const pixelValues = message.slice(2).split(',');
  pixelValues.pop();
  
  for (var compoundValue of pixelValues) {
    const parts = compoundValue.split('#');
    const pixelNumber = parseInt(parts[0]);
    const pixelColor = "#" + parts[1];
    console.log(pixelNumber, pixelColor);
  }
}

function processMessage(message) {
  const data = message.data;
  const value = data.constructor.name == "ArrayBuffer" 
                  ? new TextDecoder("utf-8").decode(data) 
                  : data;

  //console.log(value);
  
  switch(value[0]) {
    case "C":
      break;
    case "S":
      processSyncMessage(value);
      break;
    default:
      break;
  } 
}

async function connect() {
  const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
  const channelId = "tshirt";
  const channel = await ably.channels.get(channelId);
  await channel.attach();
  
  for (let cell of square) {
    cell.addEventListener("click", e => colorAndPublish(e, channel), false);   
  }

  channel.subscribe(processMessage);  
  channel.publish("tshirt", "C");  
  console.log("Subscribed");
}

connect(); 