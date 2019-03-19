const driver = require('bigchaindb-driver')

var bigchain = {}

bigchain.put = function() {
  const alice = new driver.Ed25519Keypair()
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const tx = driver.Transaction.makeCreateTransaction(
      {
        message: 'I am Zhangzhen 2'
      },
      {
        metadata: 'Zhangzhen'
      },
      [ driver.Transaction.makeOutput(
          driver.Transaction.makeEd25519Condition(alice.publicKey))],
      alice.publicKey)
  const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
  conn.postTransactionCommit(txSigned)
}

bigchain.get = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  // 90269e3165fa95501bfcf101214716c58ab1a7c85abb7eff368f0d8e9fa23127
  // 102642089971cc95154da5ce95960ed85be5115f4936a273179583e9b104b304
  const ret = conn.getTransaction('102642089971cc95154da5ce95960ed85be5115f4936a273179583e9b104b304')
  console.log('ret = ', ret)
}

bigchain.search = function() {
  const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')
  const ret = conn.searchMetadata('Zhangzhen')
  console.log('ret = ', ret)
}

export {bigchain}