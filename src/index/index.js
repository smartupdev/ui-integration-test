import $ from 'jquery'
import {ipfs} from '../component/ipfs'
// import {orbitdb} from '../component/orbitdb'
// import {gun} from '../component/gun'
// import {bigchain} from '../component/bigchain'
import {ethUtil} from '../component/ethUtil'

var account;


$(function() {

  if (typeof window.ethereum !== 'undefined' && typeof window.web3 !== 'undefined') {
    setTimeout(function () {
      $('#connectMateMaskBtn').click();
      $('#getBalance').click();
    }, 1000)
  }

  // https://metamask.github.io/metamask-docs/Main_Concepts/Getting_Started

  $('#connectMateMaskBtn').on('click', () => {
    
    if (typeof window.ethereum === 'undefined' || typeof window.web3 === 'undefined') {
      alert('浏览器未安装MateMask插件，或者被禁用');
      return;
    }

    console.log('ethereum = ', ethereum);
    console.log('web3 = ', web3);

    // MateMask登录授权
    // ethereum.enable().then((accounts) => {
    //   account = accounts[0];
    //   window.account = accounts[0];
    //   
    // }).catch((e)=> {
    //   console.log('MateMask login error = ',e);
    // });

    window.account = web3.eth.accounts[0];
    account = web3.eth.accounts[0];
    $('#publicKey').html(window.account);
    
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
    // if(!account){
    //   alert('请先连接MateMask');
    // }
    var account = web3.eth.accounts[0]
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
    web3.eth.sendTransaction({
      from: account,
      to: account.substring(2),
      value: web3.toWei(0, 'ether'),
    }, (err, txHash) => {
      if(err) {
        console.log('transaction err =', err);
      }
      $('#txHash').html(txHash)
    })
  });

  // 签名
  $('#signature').on('click', function () {
    var msg = $('#signText').val();
    web3.personal.sign(msg, account, (err, ret) => {
      if (err) {
        console.log('err', err)
      } else {
        console.log('account: ', account)
        console.log('msg: ', msg)
        console.log('sign: ', ret)
      }
    })
  })

  // ================================== eth  =====================================

  $('#balanceOf').on('click', function () {
    ethUtil.balanceOf()
  })

  $('#nttBalanceOf').on('click', function () {
    ethUtil.nttBalanceOf()
  })

  $('#createMarket').on('click', function () {
    ethUtil.createMarket()
  })

  $('#getMarketByIndex').on('click', function () {
    var index = $('#marketIndexInput').val()
    ethUtil.getMarketByIndex(index)
  })

  // 设置市场
  $('#setMarketAddress').on('click', function () {
    var addr = $('#marketAddressInput').val();
    ethUtil.setMarketAddress(addr)
  })

  //获取当前账户ct余额
  $('#getCtBalance').on('click', function () {
    ethUtil.getCtBalance()
  })

  //获取Ct市场发行量
  $('#getCtTotalSupply').on('click', function () {
    ethUtil.getCtTotoalSupply()
  })

  //获取Ct市场创建者
  $('#getCreator').on('click', function () {
    ethUtil.getCreator()
  })

  //获取Ct市场上交易的SUT
  $('#getTotalTradeSut').on('click', function () {
    ethUtil.getTotalTradeSut()
  })

  //发起内容提案
  $('#propose').on('click', function () {
    var choiceNum = $('#choiceNum').val()
    var validTime = $('#validTime').val()
    ethUtil.propose(choiceNum, validTime)
  })

  //为内容提案投票
  $('#voteForProposal').on('click', function () {
    var mychoice = $('#mychoice').val()
    var ctAmount = $('#ctAmount').val()
    var _proposalId = $('#_proposalId').val()
    ethUtil.voteForProposal(mychoice, ctAmount, _proposalId)
  })

  //内容提案结束，撤回Ct
  $('#withdrawProposalCt').on('click', function () {
    var proposalId = $('#proposalId').val()
    ethUtil.withdrawProposalCt(proposalId)
  })


  //获取内容提案的内容
  $('#getProposal').on('click', function () {
    var proposalId_ = $('#proposalId_').val()
    ethUtil.getProposal(proposalId_)
  })


  // 交易
  $('#getBidQuote').on('click', function () {
    var ctAmount = $('#bidQuoteInput').val()
    ethUtil.getBidQuote(ctAmount)
  })

  $('#getAskQuote').on('click', function () {
    var ctAmount = $('#askQuoteInput').val()
    ethUtil.getAskQuote(ctAmount)
  })

  $('#bidCt').on('click', function () {
    var bidPrice = $('#bidPriceInput').val()
    var bidAmount = $('#bidAmountInput').val()
    ethUtil.bidCt(bidPrice, bidAmount)
  })
  
  $('#askCt').on('click', function () {
    var ctAmount = $('#askInput').val();
    ethUtil.askCt(ctAmount)
  })

  // 争议
  // Dispute = Flag

  $('#marketState').on('click', function () {
    ethUtil.marketState()
  })

  $('#nextFlaggableDate').on('click', function () {
    ethUtil.nextFlaggableDate()
  })

  $('#createDispute').on('click', function () {
    var amount = $('#disputeAmount').val()
    ethUtil.createDispute(amount)
  })

  $('#flaggingPeriod').on('click', function () {
    ethUtil.flaggingPeriod()
  })

  $('#getDisputeCount').on('click', function () {
    ethUtil.getDisputeCount()
  })

  $('#getDisputeAmount').on('click', function () {
    ethUtil.getDisputeAmount()
  })

  $('#getDisputeAddresses').on('click', function () {
    ethUtil.getDisputeAddresses()
  })

  // 争议投票

  $('#flagVotingPeriod').on('click', function () {
    ethUtil.flagVotingPeriod()
  })

  $('#jurorVote').on('click', function () {
    var vote = $('#disputeVote').val()
    ethUtil.jurorVote(vote)
  })

  $('#jurorVoteDone').on('click', function () {
    ethUtil.jurorVoteDone()
  })

  $('#disputeDone').on('click', function () {
    ethUtil.disputeDone()
  })

  $('#getJurorSize').on('click', function () {
    ethUtil.getJurorSize()
  })

  $('#getJurorList').on('click', function () {
    ethUtil.getJurorList()
  })

  $('#getJurorVotes').on('click', function () {
    ethUtil.getJurorVotes()
  })

  // 争议上诉

  $('#appealRound').on('click', function () {
    ethUtil.appealRound()
  })

  $('#appealingPeriod').on('click', function () {
    ethUtil.appealingPeriod()
  })

  $('#doAppeal').on('click', function () {
    ethUtil.doAppeal()
  })

  $('#marketDissolve').on('click', function () {
    ethUtil.marketDissolve()
  })

  // 提案

  $('#doProposed').on('click', function () {
    var amount = $('#proposedAmount').val()
    ethUtil.doProposed(amount)
  })

  $('#getCurrentProposedAmount').on('click', function () {
    ethUtil.getCurrentProposedAmount()
  })

  $('#getProposedAmount').on('click', function () {
    ethUtil.getProposedAmount()
  })

  // 提案投票

  $('#proposedVotingPeriod').on('click', function () {
    ethUtil.proposedVotingPeriod()
  })

  $('#doProposedVote').on('click', function () {
    var vote = $('#proposedVote').val()
    ethUtil.doProposedVote(vote)
  })

  $('#getProposedJurors').on('click', function () {
    ethUtil.getProposedJurors();
  })

  $('#getProposedVote').on('click', function () {
    ethUtil.getProposedVote();
  })

  $('#proposedVoteDone').on('click', function () {
      ethUtil.proposedVoteDone()
  })


  //查询交易
  $('#getTransactionDetails').on('click', () => {
    var type = $('#transactionType').val()
    var hash = $('#transactionHash').val()
    ethUtil.getTransactionDetails(type, hash)
  })

  // ================================= ipfs ======================================

  $('#postIpfsJson').on('click', () => {
    var json = $('#jsonStr').val();
    console.log('json = ', json);
    if(json && json != '') {
      ipfs.postString(json, function (err, ret) {
        console.log('post err', err);
        console.log('post ret', ret);
        // alert('hash = ' + ret[0].hash);
      });
    }
  });

  $('#getIpfsFile').on('click', () => {
    var hash = $('#ipfsFileHash').val();
    if(!hash || hash === '') {
      return;
    }
    ipfs.get(hash, (err, ret) => {
      if(err) {
        console.log('get err ', err);
      }
      console.log('get success ', ret);
      if(ret) {
        if(ret[0] && ret[0].content) {
          // 文件
          var str = ret[0].content.toString('utf-8');
          console.log('string = ', str);
        } else {
          // 目录
          console.log('get success ', ret);
        }
      }
    });
  });

  $('#postIpfsImg').on('click', () => {
    var img = document.getElementById("img");
    if (!img || !img.files || !img.files[0]) {
      alert('请先选择图片');
      return;
    }
    var file = img.files[0];
    console.log(file);
    // const blob = new Blob([file],{type: file.type});

    ipfs.postFile(file, function (err, ret) {
      console.log('post err', err);
      console.log('post ret', ret);
      if(ret && ret[0] && ret[0].hash)
      console.log('File path = ', 'https://ipfs.smartup.global/ipfs/' + ret[0].hash);
      // alert('hash = ' + ret[0].hash);
    });

  })

  // ================================== bigchain ===================================

  $('#bigchainPut').on('click', () => {
    bigchain.put()
  })

  $('#bigchainGet').on('click', () => {
    bigchain.get()
  })

  $('#bigchainSearch').on('click', () => {
    bigchain.search()
  })

  $('#bigchainTransfer').on('click', () => {
    bigchain.transfer()
  })

  $('#bigchainSearchOwner').on('click', () => {
    bigchain.searchOwner()
  })


});
