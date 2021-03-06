import $ from 'jquery'
import {ipfs} from '../component/ipfs'
import {ethUtil} from '../component/ethUtil'

var account;

$(function() {

    if (typeof window.ethereum !== 'undefined' && typeof window.web3 !== 'undefined') {
        setTimeout(function () {
            $('#connectMateMaskBtn').click();
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
        ethereum.enable().then((accounts) => {

            account = accounts[0];
            window.account = accounts[0];

            $('#publicKey').html(window.account);
            $('#getBalance').click();

        }).catch((e) => {
            alert('Metamask 授权失败');
            console.log('MateMask login error = ', e);
        });

        // 网络ID
        myWeb3.eth.net.getId().then(id => {

            // 获取当前连接的网络
            var network = 'ID=' + id + ', ';
            switch (id) {
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

        }).catch(e => {
            console.log('Get network id err = ', e);
        });



    });

    $('#getBalance').on('click', () => {
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
                console.log('transaction err = ', err);
            }
            console.log('txHash = ', txHash);
        })
    });

    // 签名
    $('#signature').on('click', function () {
        let msg = $('#signText').val();
        let msgHash = msg;
        if (!msg.startsWith('0x')) {
            msgHash = myWeb3.utils.utf8ToHex(msg);
            console.log('msgHex = ', msgHash);
        } else {
            console.log('msgHex = ', msg);
        }
        web3.personal.sign(msgHash, account, (err, ret) => {
            if (err) {
                console.log('err', err)
            } else {
                console.log('account: ', account);
                console.log('msg: ', msg);
                console.log('sign: ', ret)
            }
        })
    });

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

    // ============================= 平台升级 ============================================

    $('#chargeSutBtn').on('click', function () {
        let sut = $('#chargeSutInput').val();
        ethUtil.chargeSut(sut);
    });

    $('#chargeEthBtn').on('click', function () {
        let sut = $('#chargeEthInput').val();
        ethUtil.chargeEth(sut);
    });

    $('#withdrawSutBtn').click('click', function () {
        let sut = $('#withdrawSutInput').val();
        ethUtil.withdrawSut(sut);
    });

    $('#withdrawEthBtn').click('click', function () {
        let eth = $('#withdrawEthInput').val();
        ethUtil.withdrawEth(eth);
    });

    $('#querySutInPlatform').on('click', function () {
        ethUtil.querySutInPlatform()
    });

    $('#queryEthInPlatform').on('click', function () {
        ethUtil.queryEthInPlatform()
    });

    $('#createMarketSign').on('click', function () {
        let sut = $('#gl_sut').val() + '';
        let marketId = $('#gl_marketId').val();
        let marketSymbol = $('#gl_marketSymbol').val();
        let ctCount = $('#gl_ctCount').val() + '';
        let ctPrice = $('#gl_ctPrice').val() + '';
        let ctRecyclePrice = $('#gl_ctRecyclePrice').val() + '';
        let closingTime = $('#gl_closingTime').val() + '';
        let gasLimit = $('#gl_gasLimit').val() + '';
        let gasPrice = $('#gl_gasPrice').val() + '';
        ethUtil.createMarketSign(sut, marketId, marketSymbol, ctCount, ctPrice, ctRecyclePrice, closingTime, gasLimit, gasPrice);
    });

    $('#queryMarketBalance').on('click', function () {
        let marketAddress = $('#marketAddress').val();
        ethUtil.queryMarketBalance(marketAddress);
    });

    $('#queryCtPrice').on('click', function () {
        let marketAddress = $('#marketAddress').val();
        ethUtil.queryCtPrice(marketAddress);
    });

    $('#queryCtRecyclePrice').on('click', function () {
        let marketAddress = $('#marketAddress').val();
        ethUtil.queryCtRecyclePrice(marketAddress);
    });

    $('#queryMyCtCount').on('click', function () {
        let marketAddress = $('#marketAddress').val();
        ethUtil.queryMyCtCount(marketAddress);
    });

    $('#queryMarketStage').on('click', function () {
        let marketAddress = $('#marketAddress').val();
        ethUtil.queryMarketStage(marketAddress);
    });

    $('#firstStageBuy').on('click', function () {
        let marketAddress = $('#fb_marketAddress').val() + '';
        let ctCount = $('#fb_ctCount').val();
        let userAddress = $('#fb_userAddress').val();
        let gasLimit = $('#fb_gasLimit').val() + '';
        let gasPrice = $('#fb_gasPrice').val() + '';
        let time = $('#fb_time').val() + '';
        ethUtil.firstStageBuy(userAddress, marketAddress, ctCount, gasLimit, gasPrice, time);
    });

    $('#tradeSellSign').on('click', function () {
        let marketAddress = $('#trade_marketAddress').val();
        let sutAddress = $('#trade_sutAddress').val();
        let ctCount = $('#trade_ctCount').val();
        let ctPrice = $('#trade_ctPrice').val();
        let time = $('#trade_time').val();
        ethUtil.makeSign('sell', marketAddress, sutAddress, ctPrice, ctCount, time);
    });

    $('#tradeBuySign').on('click', function () {
        let marketAddress = $('#trade_marketAddress').val();
        let sutAddress = $('#trade_sutAddress').val();
        let ctCount = $('#trade_ctCount').val();
        let ctPrice = $('#trade_ctPrice').val();
        let time = $('#trade_time').val();
        ethUtil.makeSign('buy', marketAddress, sutAddress, ctPrice, ctCount, time);
    });

    $('#takeSellSign').on('click', function () {
        let volume = $('#take_volume').val();
        let price = $('#take_price').val();
        let timestamp = $('#take_timestamp').val();
        let fee = $('#take_fee').val();
        let marketAddress = $('#take_marketAddress').val();
        ethUtil.takeSign('sell', volume, price, timestamp, fee, marketAddress);
    });

    $('#takeBugSign').on('click', function () {
        let volume = $('#take_volume').val();
        let price = $('#take_price').val();
        let timestamp = $('#take_timestamp').val();
        let fee = $('#take_fee').val();
        let marketAddress = $('#take_marketAddress').val();
        ethUtil.takeSign('buy', volume, price, timestamp, fee, marketAddress);
    });

});
