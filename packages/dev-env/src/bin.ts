import './env'
import { TestNetwork } from './network'
import { mockMailer } from './util'

const run = async () => {
  console.log(`
██████╗
██╔═══██╗
██║██╗██║
██║██║██║
╚█║████╔╝
 ╚╝╚═══╝  protocol

[ created by Bluesky ]`)

  const network = await TestNetwork.create({
    pds: {
      port: 2583,
      hostname: 'localhost',
      enableDidDocWithSession: true,
      alternativeHost: process.env.ALTERNATIVE_PDS_HOST,
    },
    bsky: {
      dbPostgresSchema: 'bsky',
      port: 2584,
      publicUrl: 'http://localhost:2584',
    },
    plc: { port: 2582 },
    ozone: {
      port: 2587,
      chatUrl: 'http://localhost:2590', // must run separate chat service
      chatDid: 'did:example:chat',
      dbMaterializedViewRefreshIntervalMs: 30_000,
    },
    introspect: { port: 2581 },
  })
  mockMailer(network.pds)

  if (network.introspect) {
    console.log(
      `🔍 Dev-env introspection server http://localhost:${network.introspect.port}`,
    )
  }
  console.log(`👤 DID Placeholder server http://localhost:${network.plc.port}`)
  console.log(`🌞 Main PDS http://localhost:${network.pds.port}`)
  console.log(
    `🔨 Lexicon authority DID ${network.pds.ctx.cfg.lexicon.didAuthority}`,
  )
  console.log(`🗼 Ozone server http://localhost:${network.ozone.port}`)
  console.log(`🗼 Ozone service DID ${network.ozone.ctx.cfg.service.did}`)
  console.log(`🌅 Bsky Appview#1 http://localhost:${network.bsky.port}`)
  console.log(`🌅 Bsky Appview#1 DID ${network.bsky.serverDid}`)
  for (const fg of network.feedGens) {
    console.log(`🤖 Feed Generator (${fg.did}) http://localhost:${fg.port}`)
  }

  if (process.env.SECOND_NETWORK === '1') {
    console.log(`--- SECOND NETWORK ---`)

    const network2 = await TestNetwork.createSecond(network, {
      pds: {
        port: 2683,
        hostname: 'localhost',
        enableDidDocWithSession: true,
        alternativeHost: process.env.ALTERNATIVE_PDS_HOST2,
      },
      bsky: {
        dbPostgresSchema: 'bsky_second',
        port: 2684,
        publicUrl: 'http://localhost:2684',
      },
      ozone: {
        chatUrl: 'http://localhost:2590', // must run separate chat service
        chatDid: 'did:example:chat',
        dbMaterializedViewRefreshIntervalMs: 30_000,
      },
    })

    if (network2.introspect) {
      console.log(
        `🔍 Dev-env introspection server http://localhost:${network2.introspect.port}`,
      )
    }
    console.log(
      `👤 DID Placeholder server http://localhost:${network2.plc.port}`,
    )
    console.log(`🌞 Main PDS http://localhost:${network2.pds.port}`)
    console.log(
      `🔨 Lexicon authority DID ${network2.pds.ctx.cfg.lexicon.didAuthority}`,
    )
    console.log(`🗼 Ozone server http://localhost:${network2.ozone.port}`)
    console.log(`🗼 Ozone service DID ${network2.ozone.ctx.cfg.service.did}`)
    console.log(`🌅 Bsky Appview#1 http://localhost:${network2.bsky.port}`)
    console.log(`🌅 Bsky Appview#1 DID ${network2.bsky.serverDid}`)
    for (const fg of network2.feedGens) {
      console.log(`🤖 Feed Generator (${fg.did}) http://localhost:${fg.port}`)
    }
  }
}

run()
