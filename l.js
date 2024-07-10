
let microwizard;
(async function() {
  const { default: Microwizard, transport } = (await import("microwizard"));
  microwizard = new Microwizard()
  mc = new Microwizard()
  const tp = transport({}, microwizard);
  const tp2 = transport({}, mc);
  tp.listen({}, function() {

    // console.log('listen', arguments)
    tp2.client({}, async (_,client) => {
      // console.log(client)

      mc.add('svc:user,cmd:*', async function (msg)  {
        console.log('helo', this)
        return await client.send(msg, { id: client.id })
      })


      console.log(await mc.act({svc: 'user', cmd: 'add', a: 5, b: 3 }).catch(console.error))
    })
  })


  microwizard.add({ svc: 'user', cmd: 'add' }, (msg) => {
  console.log('fromnet', msg)
    return { res: msg.a + msg.b };
  })
  
microwizard.add({ cmd: 'add' }, (msg) => {
  console.log('local', msg)
    return { res: msg.a + msg.b };
  })

    console.log(await microwizard.act({ cmd: "add", a: 5, b: 3 }).catch(console.error));
  console.log(await microwizard.actE('cmd:add', { a: 5, b: 3 }).catch(console.error));
})()
