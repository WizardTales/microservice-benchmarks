"use strict";
process.setMaxListeners(0);
let Promise = require("bluebird");
let Benchmarkify = require("benchmarkify");
const { uid } = require('uid')
const { spawn } = require('node:child_process');

let concurrency = 1000;
let benchmark = new Benchmarkify("Microservices benchmark").printHeader();

const bench = benchmark.createSuite("Call remote actions");
const mol = false;
const teSeneca = false
const testcote = false;

let processes = []


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

//const natsServerUrl = "nats://" + (process.env.NATS_URL || "localhost:4222");

//Moleculer
if(mol === true) {

  let broker1;
  let broker2;
  (function() {
    const { ServiceBroker } = require("moleculer");
const sub = spawn('node', ['./mol.js'])
   processes.push(sub)

      broker1 = new ServiceBroker({ nodeID: "node-1", transporter: 'TCP' });

      broker1.start();

    bench.add("Moleculer", async done => {
      const work = []
      for(let i = 0; i< concurrency; ++i) {
        work.push(broker1.call("math.add", { a: 5, b: 3 }));
      }
      await Promise.all(work)
      done()

    });
  })();
}
//
//// Hemera
//let hemera1;
//let hemera2;
//(function() {
//  const Hemera = require("nats-hemera");
//  const nats = require("nats").connect(natsServerUrl);
//
//  hemera1 = new Hemera(nats, { logLevel: "error" });
//  hemera2 = new Hemera(nats, { logLevel: "error" });
//
//  hemera2.ready(() => {
//    hemera2.add({ topic: "math", cmd: "add" }, (resp, cb) => {
//      //console.log("Call", resp);
//      cb(null, resp.a + resp.b);
//    });
//  });
//
//  bench.add("Hemera", done => {
//    hemera1.act({ topic: "math", cmd: "add", a: 5, b: 3 }, (err, res) =>
//      done()
//    );
//  });
//})();
//
// Cote
if(testcote === true) {

  let cote_resp;
  let cote_req;
  (function() {
    const cote = require("cote");

    cote_resp = new cote.Responder({ name: "bench-remote" });
    cote_req = new cote.Requester({ name: "bench-remote" });

    cote_resp.on("add", (req, cb) => {
      cb(req.a + req.b);
    });

    bench.add("Cote", async done => {

      const work = []
      for(let i = 0; i< concurrency; ++i) {
        work.push(new Promise(resolve => cote_req.send({ type: "add", a: 5, b: 3 }, res => resolve())));
      }
      await Promise.all(work)
      done()

    });
  })();
}
// 
 // Seneca
if(teSeneca === true) {
  let seneca1;
  let seneca2;
  (function () {
const sub = spawn('node', ['./seneca.js'])
   processes.push(sub)

    setTimeout(() => {

      seneca1 = require("seneca")({
        valid: { active: false },
        history: { active: false },
        trace: { unknown: true, act: true, stack: true },
        stats: { size: 0 },
        strict: { find: false, result: false, fixedargs: false },
      }).client({ type: "tcp" });
    }, 1000)
  
      
    bench.add("Seneca", async (done) => {
const work = []
    for(let i = 0; i< concurrency; ++i) {
      work.push(new Promise(resolve => seneca1.act({ cmd: "add", a: 5, b: 3 }, (err, res) => resolve())));
    }
    await Promise.all(work)
      done()

      
    });
  })();
}

let mc1;
let mc2;
(async function () {
  const { default: Microwizard, transport } = (await import("microwizard"));
  mc2 = new Microwizard({ transport: { timeout: 2000 } })
  const tp2 = transport({}, mc2);
  // const sub = spawn('node', ['./mw.js'])
  // processes.push(sub)

  // sub.stderr.on('data', x=> console.error(x.toString()))
  // sub.stdout.on('data', x=> console.log(x.toString()))


  // setTimeout(() => {

  //   // console.log('listen', arguments)
  //   tp2.client({}, async (_,client) => {
  //     // console.log(client)

  //     mc2.add('cmd:*', async (msg, meta) => {
  //       if(meta.pin) {
  //         return await client.send(msg, { p: meta.pin, id: uid(), k: 'aE' })
  //       } else {
  //         return await client.send(msg, {id: uid() })
  //       }
  //     })
  //   })
  // }, 500);

const config = {
  auto: true,
  // listen: [{ pin: 'service:user,command:*', model: 'consume', type: 'tcp' }],
  discover: {
    rediscover: true,
    custom: {
      active: true,
      find: dnsSeed
    }
  }
}


  config.bases = '127.0.0.1:39000,127.0.0.1:39001'.split(',');


  mc2.use('mesh', config)
      
  
 // bench.add("MicroWizard1",async (done) => {
 //   await mc2.act({ cmd: "add", a: 5, b: 3 });
 //   done();
 // });

 // bench.add("MicroWizard2", async (done) => {
 //   await mc2.act('cmd:add', { a: 5, b: 3 });
 //   done()
 // });
//
  // bench.add("MicroWizardActE", async function(done)  {
  //   if(concurrency > 1) {
  //     const work = []
  //     for(let i = 0; i< concurrency; ++i) {
  //       work.push(mc2.actE('cmd:add', { a: 5, b: 3 }));
  //     }
  //     await Promise.all(work)

  //   } else {
  //     await mc2.actE('cmd:add', { a: 5, b: 3 });
  //   }
  //   done()
  // });

  bench.add("MicroWizardActEService", async function(done)  {
    if(concurrency > 1) {
      const work = []
      for(let i = 0; i< concurrency; ++i) {
        work.push(mc2.actE('service:peter,command:test', {a: 5, b: 3}));
      }
      await Promise.all(work)

    } else {
      await mc2.actE('service:peter,command:test', {a: 5, b: 3});
    }
    done()
  });
})();

Promise.delay(3000).then(() => {
  return benchmark
    .run([bench])
    .then(() => benchmark.run([bench]))
    .then(() => {
      //   hemera1.close();
      //   hemera2.close();

      //   broker1.stop();
      //   broker2.stop();

      seneca2.close();
      seneca1.close();

      processes.map(x => x.kill());
      process.exit();

      //   cote_req.close();
      //   cote_resp.close();
    });
});
