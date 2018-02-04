const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "!";
var auth = require('./auth.json');
var request = require('request');
var pokemonData;

client.on("ready", () => {
    console.log("I am ready");
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix)) return;
    
    switch (message.content) {
        case "!ping":
            message.channel.send("pong!");
            break;
        
        case "!soy":
            message.channel.send("gay");
            break;       
    }

    if (message.content.startsWith("!pokemon")) {
        var pokemon = message.content.slice(8).trim().toLowerCase();
        console.log(pokemon);
        request('https://pokeapi.co/api/v2/pokemon/'+pokemon+'/', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var pokemonData = JSON.parse(body);
                var msg = 
                "nombre: " + pokemonData.name +"\n" +
                "peso: " + pokemonData.weight * .1 + "kg" + "\n" +
                "estatura: " + pokemonData.height * .1 + "m" + "\n";
                if (pokemonData.types[1] != null) {
                    msg += "tipo(s): " + pokemonData.types[1].type.name + " - " + pokemonData.types[0].type.name;
                } else {
                    msg += "tipo(s): " + pokemonData.types[0].type.name;
                }
                console.log(pokemonData);
                message.channel.send(
                   msg, {
                    file: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+ pokemonData.id +".png"
                });
                
            } else if (response.statusCode == 404) {
                message.channel.send("Escribe el nombre bien, aweonao.");
            } else if (error) {
                message.channel.send("Cagó el server, así que intenta después.")
            } else {
                message.channel.send("No sé que chucha pasó, pero no funciona esta weá.")
            }
        });
        
    }

});

client.login(auth.token);