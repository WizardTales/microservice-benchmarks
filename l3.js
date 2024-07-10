
const dns = require('dns');
function dnsSeed (seneca, options, bases, next) {
  dns.lookup(
    'test',
    {
      all: true,
      family: 4
    },
    (err, addresses) => {
      let bases = [];

      if (err) {
        throw new Error('dns lookup for base node failed');
      }

      if (Array.isArray(addresses)) {
        bases = addresses.map((address) => {
          return address.address;
        });
      } else {
        bases.push(addresses);
      }

      next(bases);
    }
  );
}

const config = {
  auto: true,
  listen: [{ pin: 'service:peter,command:*', model: 'consume', type: 'tcp' }],
  discover: {
    rediscover: true,
    custom: {
      active: true,
      find: dnsSeed
    }
  }
}


  config.bases = '127.0.0.1:39000,127.0.0.1:39001'.split(',');

let microwizard;
(async function() {
  const { default: Microwizard, transport } = (await import("microwizard"));
  microwizard = new Microwizard()

  microwizard.add('service:peter,command:test', (msg, meta) => {
    return { r: msg.a + msg.b }
  })
  
  microwizard.use('mesh', config)
})()
