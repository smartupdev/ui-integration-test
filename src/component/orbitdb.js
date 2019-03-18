import OrbitDB from 'orbit-db'
import IPFS from 'ipfs'
import IpfsApi from 'ipfs-api'

const orbitdb = {}

// https://ipfs.smartup.global/ipfs/QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc
// '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd'

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  }
}

// const ipfs = new IPFS(ipfsOptions);
// const ipfsApi = new IpfsApi('ipfs-api.smartup.global', '80');
// const orbitdb = new OrbitDB(ipfs);


// const ipfs = IpfsApi('ipfs-api.smartup.global', '80');
// const odb = new OrbitDB(ipfs);


orbitdb.initDb = function() {

}

export {orbitdb}