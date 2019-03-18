import ipfsClient from 'ipfs-http-client'
import blobinfo from 'blobinfo'
var Buffer = require('buffer/').Buffer

const ipfs = {};

const client = ipfsClient('ipfs-api.smartup.global', '80', { protocol: 'http' });
// ipfs.client = client;

ipfs.get = (hash, callback) => {
  // 目录 QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc
  client.get(hash, callback);
}

ipfs.post = (string, callback) => {
  var data = new Buffer(string, 'utf8');
  client.add(data, null, callback);
}

ipfs.postImg = () => {
  
}

export {ipfs}