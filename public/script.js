 console.log("Oh hai! 🖤");

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    

docReady(function() {
  let color = document.getElementsByClassName('color');
  let square = document.getElementsByClassName('square');
  let selected = "white";
  let pixel = 0;
  let rgb = "0,0,0"
  
  for(let i = 0; i < color.length; i++) {
    color[i].addEventListener("click", function(e){
      selected = e.target.id;
    }, false);   
  }
  
  for(let i = 0; i < square.length; i++) {
    square[i].addEventListener("click", function(e){
      pixel = e.target.id.replace('square', '');
      console.log()
      e.target.style.fill = selected;
    }, false);   
  }
  
  async function connect() {
    const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
    const channelId = "tshirt";
    const channel = await ably.channels.get(channelId);
    await channel.attach();
    
    channel.publish("color", "hello");

    channel.subscribe(function(message) {
      console.log(message.data);
    }); 
    
    console.log("Subscribed");
  }
  connect(); 
});