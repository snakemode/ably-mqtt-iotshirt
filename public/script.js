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
  function send(e) {
    console.log(e.target.id);
  }
  
  async function connect() {
    const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' });
    const channelId = "tshirt";
    const channel = await ably.channels.get(channelId);
    await channel.attach();
    
    channel.publish("update", "hello");

    channel.subscribe(function(message) {
      console.log(message.data);
    }); 
    
    console.log("Subscribed");
  }
  connect(); 
});