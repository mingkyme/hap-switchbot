const hap = require("hap-nodejs");
const axios = require('axios').default;
const switchbotOption = require('./secret/switchbot.json');
const discordOption = require('./secret/discord.json');
const mqtt = require('mqtt');
const mqttOption = require('./secret/mqtt.json');
const client  = mqtt.connect(mqttOption.host,mqttOption);

var state = false;
client.on("connect", () => { });
client.subscribe(`iot/switchbot/${switchbotOption.botId}/state`);
client.on('message',(topic,payload,packet) =>{
  state = !JSON.parse(payload).state;
});

const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

const accessoryUuid = hap.uuid.generate("me.mingky.switchbot");
const accessory = new Accessory("switchbot", accessoryUuid);

const switchService = new Service.Switch("Room Switchbot");

const onCharacteristic = switchService.getCharacteristic(Characteristic.On);


// with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
  console.log("GET ", state);
  callback(undefined, state);
});
onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
  client.publish(`iot/switchbot/${switchbotOption.botId}`,value?"ON":"OFF");
  axios.post(discordOption.url,{"content":`${new Date().toISOString().replace('T', ' ').substring(0, 19)} ${value?"ON":"OFF"}`});
  state = value;
  callback();
});

accessory.addService(switchService);

// once everything is set up, we publish the accessory. Publish should always be the last step!
accessory.publish({
  username: "17:51:07:F4:BC:8B",
  pincode: "123-45-678",
  port: 47129,
  category: hap.Categories.SWITCH, // value here defines the symbol shown in the pairing screen
});

console.log("Accessory setup finished!");