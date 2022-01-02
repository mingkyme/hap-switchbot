const hap = require("hap-nodejs");
const axios = require('axios').default;
const switchbotOption = require('./secret/switchbot.json');

const Accessory = hap.Accessory;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;
const Service = hap.Service;

const accessoryUuid = hap.uuid.generate("me.mingky.switchbot");
const accessory = new Accessory("switchbot", accessoryUuid);

const switchService = new Service.Switch("Room Switchbot");

const onCharacteristic = switchService.getCharacteristic(Characteristic.On);

currentSwitchState = false;
// with the 'on' function we can add event handlers for different events, mainly the 'get' and 'set' event
onCharacteristic.on(CharacteristicEventTypes.GET, callback => {
  callback(undefined, currentSwitchState);
});
onCharacteristic.on(CharacteristicEventTypes.SET, (value, callback) => {
  axios.get(`https://auto.mingky.me/switchbot/${switchbotOption.botId}/${value?"ON":"OFF"}`);
  currentSwitchState = value;
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