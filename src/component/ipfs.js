import ipfsClient from 'ipfs-http-client'
import blobinfo from 'blobinfo'

const ipfs = {};

const client = ipfsClient('ipfs-api.smartup.global', '80', { protocol: 'http' });
// ipfs.client = client;

ipfs.get = () => {
  client.get('QmbRFpPsAgZSSuuj7Q2mEWSo3GAMD92JQMBL6A9zNyHWFc', (err, files) => {
    files.forEach((file) => {
      
      console.log(file);

      if (file.content) {
        // console.log(file.content.toString('utf8'));

        // var type = blobinfo.inspect(new Buffer(file.content));
        // console.log('type =', type);
      }
      
    })
  })
}

ipfs.post = (path, callback) => {
  
}

export {ipfs}