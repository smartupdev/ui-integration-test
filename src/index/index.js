import $ from 'jquery'
import {ipfs} from '../component/ipfs'
import {orbitdb} from '../component/orbitdb'

var account;

$(function() {

  // https://metamask.github.io/metamask-docs/Main_Concepts/Getting_Started

  $('#connectMateMaskBtn').on('click', () => {
    
    if (typeof window.ethereum === 'undefined' || typeof window.web3 === 'undefined') {
      alert('浏览器未安装MateMask插件，或者被禁用');
      return;
    }

    console.log('ethereum = ', ethereum, 'web3 = ', web3);

    // MateMask登录授权
    ethereum.enable().then((accounts) => {
      console.log(accounts);
      account = accounts[0];
      $('#publicKey').html(account);
    }).catch((e)=> {
      console.log('MateMask login error = ',e);
    });
    
    // 获取当前连接的网络
    var network = 'ID=' + web3.version.network + ', ';
    switch (web3.version.network) {
      case '1':
        network += '主网络';
        break;
      case '3':
        network += 'Ropsten测试网络';
        break;
      case '4':
        network += 'Rinkeby测试网络';
        break;
      case '42':
        network += 'Kovan测试网络';
        break;
      default:
        network += '测试网络';
        break;
    }
    $('#netId').html(network);
  
  });

  $('#getBalance').on('click', () => {
    if(!account){
      alert('请先连接MateMask');
    }
    // account = web3.eth.coinbase;
    web3.eth.getBalance(account, (err, balance) => {
      if(err) {
        console.log('get balance err =', err);
      }
      var numb = web3.fromWei(balance, 'ether') + ' ETH';
      $('#ethBalance').html(numb);
    });

  });

  $('#transaction').on('click', () => {
    if(!account){
      alert('请先连接MateMask');
    }
    web3.eth.sendTransaction({
      from: account,
      to: account.substring(2),
      value: web3.toWei(0.01, 'ether'),
    }, (err, txHash) => {
      if(err) {
        console.log('transaction err =', err);
      }
      $('#txHash').html(txHash)
    })
  });

  $('#getIpfsFile').on('click', () => {
    ipfs.get();
  })

  $('#initDb').on('click', () => {
    orbitdb.initDb();
  })

});