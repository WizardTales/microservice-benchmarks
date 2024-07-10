"use strict";

let Promise = require("bluebird");
let Benchmarkify = require("benchmarkify");

let benchmark = new Benchmarkify("Microservices benchmark").printHeader();

const bench = benchmark.createSuite("Call local actions");

/* Hemera (not relevant)
let hemera;
(function () {

	const Hemera = require('nats-hemera');
	const nats = require('nats').connect("nats://localhost:4222");

	hemera = new Hemera(nats, { logLevel: 'error' });

	hemera.ready(() => {
		hemera.add({ topic: 'math', cmd: 'add' }, (resp, cb) => {
			//console.log("Call", resp);
			cb(null, resp.a + resp.b);
		});
	});

	bench.add("Hemera", done => {
		hemera.act({ topic: 'math', cmd: 'add', a: 5, b: 3 }, (err, res) => {
			if (err)
				console.error(err);

			done();
		});
	});

})();
*/

// Moleculer
let broker;
(function() {
  const { ServiceBroker } = require("moleculer");
  broker = new ServiceBroker();

  broker.createService({
    name: "math",
    actions: {
      add({ params }) {
        return params.a + params.b;
      }
    }
  });
  broker.start();

   bench.add("Moleculer", done => {
   	broker.call("math.add", { a: 5, b: 3 }).then(done);
   });
})();

// Nanoservices
let nanoservices;
(function() {
  const { Manager } = require("nanoservices");

  nanoservices = new Manager();

  nanoservices.register("add", function(ctx) {
    // ctx.debug('add: a=%s, b=%s', ctx.params.a, ctx.params.b);
    ctx.result(ctx.params.a + ctx.params.b);
  });

  //bench.add("Nanoservices", done => {
  //	nanoservices.call('add', { a: 5, b: 3 }, (err, ret) => {
  //		if (err)
  //			console.error(err);
  //
  //		done();
  //	});
  //});
})();

// Seneca
let seneca;
(function() {
  seneca = require("seneca")({valid: {active: false }, history: {active: false}, trace: { unknown: false }, stats: {size: 0}, strict: {find: false, result: false,fixedargs:false}});

  seneca.add({ cmd: "add" }, (msg, done) => {
    // console.log("Call", msg);
    done(null, { res: msg.a + msg.b });
  });

  bench.add("Seneca", done => {
    seneca.act({ cmd: "add", a: 5, b: 3 }, (err, res) => {
      if (err) console.error(err);

      done();
    });
  });
})();

let microwizard;
(async function() {
  const Microwizard = (await import("microwizard")).default;
  microwizard = new Microwizard()

  microwizard.add({ cmd: 'add', a: '5' }, (msg) => {
    return { res: msg.a + msg.b };
  })
  

  bench.add("MicroWizard", async done => {
    await microwizard.act({ cmd: "add", a: 5, b: 3 }).catch(console.error);

    done();
  });


bench.add("MicroWizard2", async done => {
    await microwizard.actE({ cmd: "add", a: 5}, { b: 3 }).catch(console.error);

    done();
  });

bench.add("MicroWizard2Str", async done => {
  await microwizard.actE('cmd:add', { a: 5, b: 3 }, {mixin: ['a']}).catch(console.error);

    done();
  });

bench.add("MicroWizard2StrNoMix", async done => {
  await microwizard.actE('cmd:add,a:5', { b: 3 }).catch(console.error);

    done();
  });


bench.add("MicroWizardStr", async done => {
  await microwizard.act('cmd:add', { a: 5, b: 3 }).catch(console.error);

    done();
  });



  
  console.log(microwizard)
})();

Promise.delay(1000)
  .then(() => benchmark.run([bench]))
  .then(() => {
    broker.stop();
  });
