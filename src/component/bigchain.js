const driver = require('bigchaindb-driver')

var bigchain = {}

bigchain.put = function() {

  // const keypair = new driver.Ed25519Keypair()

  const keypair = {
    privateKey: "4Tt3eNVEMbipQEJtBVp85XdjpVtqUiwoTV63mX7CdWV6",
    publicKey: "ECnkxTGTrKq5ycJiyAkHMNLBLHgvucBQchZBBQHTZaEr"
  }

  // const keypair = {
  //   privateKey: "GX8Xbc6zL95KatSHHhZ1DTj5GnGTNdJ7A4Dd65rD6L6Y",
  //   publicKey: "5PRxDp4CeGhFtXQ9SF5ES4ncV8AYFTZ9wvq1Tt4mhV5H" 
  // }

  console.log('keypair = ', keypair);

  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const tx = driver.Transaction.makeCreateTransaction(
    {
      message: 'owner_test_string_3',
      asd: {
        asd: 'asd'
      },
      time: ''
    },
    {
      metadata: 'smartup_mark_0x123123123'
    },
    [
      driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(keypair.publicKey))
    ],
    keypair.publicKey
  )
  const txSigned = driver.Transaction.signTransaction(tx, keypair.privateKey)
  conn.postTransactionCommit(txSigned)
}

bigchain.get = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  // 1d7e0799843d6a97fc150a09b60beef3467ba6cd2b4925f437494453a6a4b9cc
  // 0741b0973b0187a50f69eb4fb8041b52a5ae8aade11397f6609b1c8740818110
  // 1909e02623bce019943469e651e78c93a4615e38a631342cf8ba09dd1c56110e
  // 2e08ea51250eef977b494e8ddef104617578bdc89ddd938e30acaece1951cc04
  // 1dee8d1fcba5e9b41762f472cec00658538f4ec4fcdc2df13ea814989a0e1578
  const ret = conn.getTransaction('122760992a5b244029c2887602cbae98a22d5be1ea7dc93c7e7770b0731fecb4')
  console.log('ret = ', ret)
}

bigchain.search = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const ret = conn.searchMetadata('smartup_mark_2')
  console.log('ret = ', ret)
}

bigchain.transfer = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const ret = conn.searchMetadata('smartup_mark_1')
  console.log('ret = ', ret)
}

bigchain.searchOwner = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const ret = conn.searchAssets('owner_test_string_3')
  console.log('ret = ', ret)
}

export {bigchain}