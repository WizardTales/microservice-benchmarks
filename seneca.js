let seneca1;
(function () {

seneca2 = require("seneca")({
      valid: { active: false },
      history: { active: false },
      trace: { unknown: true, act: true, stack: true },
      stats: { size: 0 },
      strict: { find: false, result: false, fixedargs: false },
    })
      .add({ cmd: "add" }, (msg, done) => {
        // console.log("Call", msg);
        done(null, { res: msg.a + msg.b });
      })
      .listen({ type: "tcp" });

})()
