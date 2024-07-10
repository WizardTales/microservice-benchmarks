process.setMaxListeners(0);
let mc1;
(async function () {
  const { default: Microwizard, transport } = (await import("microwizard"));
  mc1 = new Microwizard()
  const tp = transport({}, mc1);

  tp.listen({}, function() {
  })



  mc1
    .add({ cmd: "add" }, (msg) => {
      // console.log("Call", msg);
      return { res: msg.a + msg.b };
    })

})();
