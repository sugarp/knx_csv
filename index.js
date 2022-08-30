const csv = require('csv-parser')
const fs = require('fs')
const results = [];


fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {


    writeSwitches(results)
    writeBinarySensors(results)
    writeSensors(results)

  });


  function writeLine(line, indentation) {
    const tab = ' '
    fs.writeFileSync('knx.yaml', `\n${line}`, { flag: 'a+' }, err => {});
  }

  function writeSwitches(groupObjects = []) {
        const switches = groupObjects.filter(address => address.address.includes('/3/') && !address.name.includes('LED') && address.name !== ' ');

        writeLine('switch:')
        switches.forEach(s => {
          writeLine(` - name: "${s.name}"`);
          writeLine(`   address: "${s.address}"`);
        });
  }


  function writeBinarySensors(groupObjects = []) {
        const binary_sensors = groupObjects.filter(address => address.address.includes('/2/') && address.name !== ' ');

        writeLine('binary_sensor:')
        binary_sensors.forEach(bs => {
          writeLine(` - name: "${bs.name}"`);
          writeLine(`   state_address: "${bs.address}"`);
          writeLine(`   device_class: motion`);
        });
  }

  function writeSensors(groupObjects = []) {
        const sensors = groupObjects.filter(address => address.address.includes('/1/') && address.name !== ' ')

        writeLine('sensor:')
        sensors.forEach(s => {
          writeLine(` - name: "${s.name}"`);
          writeLine(`   state_address: "${s.address}"`);
          writeLine(`   type: ${getSensorType(s)}`);
        });
  }

  function getSensorType(sensor) {
    return sensor.name.includes('jas') ? 'brightness' : 'temperature'
  }
