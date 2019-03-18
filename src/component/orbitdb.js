import OrbitDB from 'orbit-db'
import IPFS from 'ipfs'
import IpfsApi from 'ipfs-api'

// const odb = new OrbitDB(ipfs);

// https://ipfs.smartup.global/ipfs/QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc
// '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd'

const orbitdb = {}

orbitdb.initDb = function() {

  

  const ipfs = IpfsApi('ipfs-api.smartup.global', '80');
  const orbitdb = new OrbitDB(ipfs);
  orbitdb.log('hello').then((db) => {

    console.log('db =', db);
  })

}

export {orbitdb}