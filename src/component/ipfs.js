import ipfsClient from 'ipfs-http-client'
import blobinfo from 'blobinfo'
import toBuffer from 'blob-to-buffer'
var Buffer = require('buffer/').Buffer

const ipfs = {};

const client = ipfsClient('ipfs-api.smartup.global', '80', { protocol: 'http' });
// ipfs.client = client;

ipfs.get = (hash, callback) => {
  // 目录 QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc
  client.get(hash, callback);
}

ipfs.postString = (string, callback) => {
  const data = new Buffer(string, 'utf8');
  client.add(data, null, callback);
}

ipfs.postFile = (file, callback) => {
  const blob = new Blob([file],{type: file.type});
  console.log('blob', blob);
  // const data = new Buffer(blob);
  // const data = Buffer.from(blob);
  toBuffer(blob, (err, buffer) => {
    client.add(buffer, null, callback);
  })
  
}

export {ipfs}