process.setMaxListeners(0);
let broker1;
  let broker2;
  (function() {
    const { ServiceBroker } = require("moleculer");
    broker2 = new ServiceBroker({ nodeID: "node-2", transporter: 'TCP' });

    broker2.createService({
      name: "math",
      actions: {
        add(ctx) {
          return ctx.params.a + ctx.params.b;
        }
      }
    });
    broker2.start();
  })();
