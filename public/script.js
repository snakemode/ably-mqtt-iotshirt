console.log("Oh hai! 🖤");

const color = document.getElementsByClassName('color');
const square = document.getElementsByClassName('square');
const colorMap = [...document.querySelectorAll('[data-rgb]')];

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
    const pixelNumber = parts[0];
    const pixelColor = ("#" + parts[1]).toLowerCase();
    
    const paddingPixelNumber = pixelNumber.padStart(3, '0')
    const id = "square" + paddingPixelNumber;
    const colourToFillWith = colorMap.filter(entry => entry.dataset.rgb == pixelColor)[0];
    const cssName = colourToFillWith.id;
    
    document.getElementById(id).style.fill = cssName;
  }
}

function processMessage(message) {
  const data = message.data;
  const value = data.constructor.name == "ArrayBuffer" 
                  ? new TextDecoder("utf-8").decode(data) 
                  : data;
  
  switch(value[0]) {
    case "C":
      break;
    case "S":
      processSyncMessage(value);
      break;
    default:
      console.log("Single update", value);
      processSyncMessage("S:" + value);
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