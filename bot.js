const Discord = require("discord.js");
const client = new Discord.Client();
let cheerio = require('cheerio');
var request = require('request');

const prefix = "!";

var auth = require('./auth.json');



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
            
        case "!nextsteamsale":
            var url = "https://www.whenisthenextsteamsale.com/";

            request(url, function(error, response, html) {
        
                if (!error) {
                    var $ = cheerio.load(html);
        
                    $('#hdnNextSale').filter(function() {
                        var data = $(this);
                        var sale = JSON.parse(data[0].attribs.value);
                        console.log(sale);
                        var remainingTimeData = sale.RemainingTime.split(".");
                        message.channel.send(
                            "Name:\t\t\t\t\t   " + sale.Name + "\n" +
                            "Start Date:\t\t\t   " + sale.StartDate + "\n" +
                            "End Date:\t\t\t\t " + sale.EndDate + "\n" +
                            "Is Confirmed:\t\t  " + sale.IsConfirmed + "\n" +
                            "Length:\t\t\t\t\t " + sale.Length + " days" + "\n" +
                            "Remaining Time:\t" + remainingTimeData[0] + " days, " 
                            + remainingTimeData[1] + " hours"
                        );
                    });
                    
                } else {
                    console.log(error);
                }
                
            });
          
    }

    if (message.content.startsWith("!pokemon")) {
        var pokemon = message.content.slice(8).trim().toLowerCase();
        console.log(pokemon);
        request('https://pokeapi.co/api/v2/pokemon/'+pokemon+'/', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var pokemonData = JSON.parse(body);
                var msg = 
                "Name: " + pokemonData.name +"\n" +
                "Weight: " + pokemonData.weight * .1 + "kg" + "\n" +
                "Height: " + pokemonData.height * .1 + "m" + "\n";
                if (pokemonData.types[1] != null) {
                    msg += "Type(s): " + pokemonData.types[1].type.name + " - " + pokemonData.types[0].type.name;
                } else {
                    msg += "Type(s): " + pokemonData.types[0].type.name;
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