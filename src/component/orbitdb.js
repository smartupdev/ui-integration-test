import OrbitDB from 'orbit-db'
import IPFS from 'ipfs'

// const odb = new OrbitDB(ipfs);

const orbitdb = {}
const node = new IPFS(
  {
    preload: {
      enabled: true,
      addresses: [
        // https://ipfs.smartup.global/ipfs/QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc
        '/dns4/ipfs-socket.smartup.global/tcp/80/ws/ipfs/QmUjDJSF4uTC5W9tKdzSWWMfk1ho859BHWNyKUQhc8Lp9L'
      ]
    }
  }
)
const data = 'Hello, JS IPFS'

orbitdb.test = function() {
  // odb.keyvalue('profile').then((err, ret) => {
  //   console.log('err =', err);
  //   console.log('ret =', ret);
  // })

  console.log('test function', node);

  node.swarm.addrs().then((err, ret) => {
    console.log(err , ret);
    
  })
  

  // once the node is ready
  // node.once('ready', () => {
  //   // convert your data to a Buffer and add it to IPFS
  //   node.files.add(node.types.Buffer.from(data), (err, files) => {
  //     if (err) return console.error(err)

  //     // 'hash', known as CID, is a string uniquely addressing the data
  //     // and can be used to get it again. 'files' is an array because
  //     // 'add' supports multiple additions, but we only added one entry
  //     console.log(files[0].hash)
  //   })
  // })

}

export {orbitdb}