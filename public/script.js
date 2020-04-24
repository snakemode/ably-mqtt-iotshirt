 console.log("Oh hai! 🖤");

  const resultsDiv = document.getElementById("history");

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

    const resultPage = await channel.history({ untilAttach: true, limit: 1 }); 

    for (const item of resultPage.items) {
      const result = document.createElement("div");
      result.classList.add("item");
      result.innerHTML = JSON.stringify(item);
      resultsDiv.appendChild(result);
  }
}
connect(); 
