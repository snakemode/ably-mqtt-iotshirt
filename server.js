const express = require("express");

var Ably = require('ably/promises');
const client = new Ably.Realtime(process.env.ABLY_API_KEY);

const app = express();
app.use(express.static("public"));

app.get("/", async (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/createTokenRequest", async (request, response) => {
  const tokenRequestData = await client.auth.createTokenRequest({ clientId: 'trainagotchi' });
  response.send(tokenRequestData);
});

/*
async function createTokenRequest(request) {
  request = request || { clientId: 'trainagotchi' };
  return new Promise((resolve, reject) => {  
    client.auth.createTokenRequest(request, function(err, tokenRequest) {    
        if (err) { reject(err); } else { resolve(tokenRequest); }
    });
  });
}*/

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});