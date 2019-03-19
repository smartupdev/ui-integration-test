// import OrbitDB from 'orbit-db'
// import IPFS from 'ipfs'
// import IpfsApi from 'ipfs-api'

// const IPFS = require('ipfs')

const IpfsApi = require('ipfs-api')
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const orbitdb = {}


// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
// Note that these options need to be passed to IPFS in
// all examples even if not specified so.
const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
}



const ipfs = new IPFS(ipfsOptions);
const ipfsApi = new IpfsApi('ipfs-api.smartup.global', '80');
const odb = new OrbitDB(ipfs);


// const ipfs = IpfsApi('ipfs-api.smartup.global', '80');
// const odb = new OrbitDB(ipfs);


orbitdb.initDb = () =>{
//   console.log('1111111111111')
//   ipfs.on('error', (e) => console.error('error',e))
//   ipfs.on('ready', async () => {
//     console.log('ready')
//   const orbitdb = new OrbitDB(ipfs)
  
//   // Create / Open a database
//   const db = await orbitdb.log('hello')
//   await db.load()
//   console.log('load')
//   // Listen for updates from peers
//   db.events.on('replicated', (address) => {
//     console.log(db.iterator({ limit: -1 }).collect())
//   })

//   // Add an entry
//   const hash = await db.add('world')
//   console.log(hash)


//   // Query
//   const result = db.iterator({ limit: -1 }).collect()
//   console.log(JSON.stringify(result, null, 2))
// })

  // =====================

  // var path = '/orbitdb/QmaGY1cooFzHd6LeLhGsj9ybgvPg513eTHYEZVb6b79TXx/hello';
  var path = '/orbitdb/QmWy4acbHLb3pdrVR9gLrMHCeoeKRMnbhXxkeohYc9YZTn/testaaa';
  

  console.log('init db = ', path);

  odb.log(path).then(db => {
    
    console.log('db = ', db);
    
    db.add('test word', function(hash){
      console.log('hash = ', hash);
    });

  }).catch((err)=>{
      console.log("aaaaaaaaaaaaa",err);
  });
  
  


}

export {orbitdb}