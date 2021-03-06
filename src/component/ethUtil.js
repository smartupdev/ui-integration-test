import Web3 from 'web3';

var ethUtil = {}


// ropsten
const adminAddress = '0xea997cfc8beF47730DFd8716A300bDAB219c1f89';
const sutContractAddress ='0xf1899c6eb6940021c1ae4e9c3a8e29ee93704b03';
const smartupContractAddress = '0x184a3dad8912a81ab393b83892f2039ec0297132';
const nttContractAddress = '0x846ce03199a759a183cccb35146124cd3f120548';
const exchangeContractAddress = '0xABaed2d6B739cd7B9c54C818300520592344Fd96';

if (!window.web3) {
    alert('请先安装metamask');
}

const myWeb3 = new Web3(web3.currentProvider);
window.myWeb3 = myWeb3;
// console.log('myWeb3 : ', myWeb3);



// ----------------------------------- 市场 ----------------------------------------------------

// CT市场地址
var marketAddress = '';

// SUT余额
ethUtil.balanceOf = function() {

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'balanceOf',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [window.account]);

    // call
    myWeb3.eth.call({
        to: sutContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('SUT余额为', myWeb3.utils.fromWei(ret));
        }
    });

}

//发起内容提案
ethUtil.propose = function(choiceNum, validTime) {
    var num = myWeb3.eth.abi.encodeParameter('uint8', choiceNum);
    var time =  myWeb3.eth.abi.encodeParameter('uint8', validTime);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'propose',
        type: 'function',
        inputs: [
            {
                type: 'uint8',
                name: 'choiceNum'
            },
            {
                type: 'uint8',
                name: 'validTime'
            }
        ]
    }, [num, time]);

    // call
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('发送发起内容提案交易，交易哈希为： ', ret);
        }
    });
}

//为内容提案投票
ethUtil.voteForProposal = function(mychoice, ctAmount, _proposalId) {
    ctAmount = myWeb3.utils.toWei(ctAmount);
    var choice = myWeb3.eth.abi.encodeParameter('uint8', mychoice);
    var ct =  myWeb3.eth.abi.encodeParameter('uint256', ctAmount);

    //var id = myWeb3.eth.abi.encodeParameter('bytes32', _proposalId);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'voteForProposal',
        type: 'function',
        inputs: [
            {
                type: 'uint8',
                name: 'mychoice'
            },
            {
                type: 'uint256',
                name: 'ctAmount'
            },
            {
                type: 'bytes32',
                name: '_proposalId'
            }
        ]
    }, [choice, ct, _proposalId]);

    // call
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            // myWeb3.utils.fromWei(ret)
            console.log('发送为内容提案投票交易, 交易哈希为： ', ret);
        }
    });

}

//内容提案到期，为内容提案撤回Ct
ethUtil.withdrawProposalCt = function(_proposalId) {
    //var id = myWeb3.eth.abi.encodeParameter('bytes32', _proposalId);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'withdrawProposalCt',
        type: 'function',
        inputs: [
            {
                type: 'bytes32',
                name: '_proposalId'
            }
        ]
    }, [_proposalId]);

    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            // myWeb3.utils.fromWei(ret)
            console.log('内容提案到期,发送撤回CT交易， 交易哈希为： ', ret);
        }
    });

}

//查询内容提案详情
ethUtil.getProposal = function(_proposalId) {
    //var id = myWeb3.eth.abi.encodeParameter('bytes32', _proposalId);
    // console.log(_proposalId);

    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'getProposal',
        type: 'function',
        inputs: [
            {
                type: 'bytes32',
                name: '_proposalId'
            }
        ]
    }, [_proposalId]);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            var ctInfo = myWeb3.eth.abi.decodeParameters(['uint256', 'uint256[]', 'address[]', 'address'], ret);
            var validTime = new Date(ctInfo[0] * 1000);
            var voteDetails = ctInfo[1];
            var voters = ctInfo[2];
            var origin = ctInfo[3];
            console.log('投票截止时间为: ', validTime);
            console.log("投票详情为: ",voteDetails);
            console.log("投票人有: ", voters);
            console.log("投票发起人为: ", origin);
        }
    });

}


// NTT余额
ethUtil.nttBalanceOf = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'checkCredit',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [window.account]);

    // call
    myWeb3.eth.call({
        to: nttContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            var val = myWeb3.eth.abi.decodeParameter('uint256', ret);
            // myWeb3.utils.fromWei(ret)
            console.log('NTT余额为', val);
        }
    });
}

ethUtil.createMarket = function() {

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'approveAndCall',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: '_spender'
            },
            {
                type: 'uint256',
                name: '_value'
            },
            {
                type: 'bytes',
                name: '_extraData'
            }
        ]
    }, [smartupContractAddress, '2500000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000001']);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: sutContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('创建市场成功，交易hash为：', ret);
        }
    });

}

ethUtil.getMarketByIndex = function(index) {

    var decodeIndex = myWeb3.eth.abi.encodeParameter('uint256', index);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'markets',
        type: 'function',
        inputs: [
            {
                type: 'uint256',
                name: 'index'
            }
        ]
    }, [decodeIndex]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            var addr = myWeb3.eth.abi.decodeParameter('address', ret);
            console.log('市场地址：', addr)
        }
    });

}

ethUtil.setMarketAddress = function (addr) {
    marketAddress = addr;
    console.log('设置市场成功')
}


// ct余额
ethUtil.getCtBalance = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'balanceOf',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [window.account]);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('CT余额为', myWeb3.utils.fromWei(ret));
        }
    });
}

// 市场状态
ethUtil.marketState = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'state',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            console.log('市场状态(0 Active, 1 Voting, 2 Dissolving, 3 Dissolved):  ', myWeb3.eth.abi.decodeParameter('uint8', ret));
        }
    });
}

// 市场创建者
ethUtil.getCreator = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'creator',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            console.log('创建者地址为:', myWeb3.eth.abi.decodeParameter('address', ret));
        }
    });
}

// 当前市场中的SUT
ethUtil.getTotalTradeSut = function() {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'totalTraderSut',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            console.log('市场总交易SUT为：', myWeb3.utils.fromWei(ret))
        }
    });

}

ethUtil.getBidQuote = function (ctAmount) {
    ctAmount = myWeb3.utils.toWei(ctAmount)
    var encodeCtAmount = myWeb3.eth.abi.encodeParameter('uint256', ctAmount);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'bidQuote',
        type: 'function',
        inputs: [
            {
                type: 'uint256',
                name: 'ctAmount'
            }
        ]
    }, [encodeCtAmount]);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            console.log('需要SUT：', myWeb3.utils.fromWei(ret))
        }
    });
}

ethUtil.getAskQuote = function (ctAmount) {
    ctAmount = myWeb3.utils.toWei(ctAmount)
    var encodeCtAmount = myWeb3.eth.abi.encodeParameter('uint256', ctAmount);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'askQuote',
        type: 'function',
        inputs: [
            {
                type: 'uint256',
                name: 'ctAmount'
            }
        ]
    }, [encodeCtAmount]);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if(err) {
            console.log(err, ret);
        } else {
            console.log('价值SUT：', myWeb3.utils.fromWei(ret))
        }
    });
}

// 买入CT
ethUtil.bidCt = function (ctPrice, ctAmount) {
    // 买入CT 调用SUT合约地址
    // 函数 approveAndCall
    // 参数 CT地址， quote价格*1.1，CT数量

    var decodeCtPrice = myWeb3.utils.toWei(ctPrice);
    // console.log('decodeCtPrice:', decodeCtPrice);

    var ctAmountWei = myWeb3.utils.toWei(ctAmount);
    var decodeCtAmount = myWeb3.eth.abi.encodeParameter('uint256', ctAmountWei);
    // console.log('decodeCtAmount:', decodeCtAmount)

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'approveAndCall',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: '_spender'
            },
            {
                type: 'uint256',
                name: '_value'
            },
            {
                type: 'bytes',
                name: '_extraData'
            }
        ]
    }, [marketAddress, decodeCtPrice, decodeCtAmount]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: sutContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('购买成功，交易hash为：', ret);
        }
    });
}


// 卖入CT
ethUtil.askCt = function(ctAmount) {
    var ctAmountWei = myWeb3.utils.toWei(ctAmount);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'sell',
        type: 'function',
        inputs: [
            {
                type: 'uint256',
                name: 'ctAmount'
            }
        ]
    }, [ctAmountWei]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('卖出成功，交易hash为：', ret);
        }
    });

}


// ----------------------------------- 争议 ----------------------------------------------------

// 允许下次争议开始的时间
ethUtil.nextFlaggableDate = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'nextFlaggableDate',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            var timestamp = myWeb3.eth.abi.decodeParameter('uint256', ret);
            var time = new Date(timestamp * 1000);
            console.log('允许下次争议开始的时间为', time);
        }
    });
}

// 发起争议
ethUtil.createDispute = function (sutAmount) {

    var sutAmountWei = myWeb3.utils.toWei(sutAmount);
    console.log('window.account', window.account)
    console.log('sutContractAddress', sutContractAddress)
    console.log('smartupContractAddress ', smartupContractAddress);
    console.log('sutAmountWei ', sutAmountWei);
    console.log('marketAddress ', marketAddress);

    var extraData = '0x0000000000000000000000' + marketAddress.substr(2, 40) + '02';
    console.log('extraData ', extraData);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'approveAndCall',
        type: 'function',
        inputs: [
            {
                type: 'address'
            },
            {
                type: 'uint256'
            },
            {
                type: 'bytes'
            }
        ]
    }, [smartupContractAddress,  sutAmountWei, extraData]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: sutContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('发起争议成功，交易hash为：', ret);
        }
    });

}

// 本次争议的开始时间和结束时间
ethUtil.flaggingPeriod = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'flaggingPeriod',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            var timestamps = myWeb3.eth.abi.decodeParameters(['uint256', 'uint256'], ret);
            var start = new Date(timestamps[0] * 1000);
            var end = new Date(timestamps[1] * 1000);
            console.log('本次争议的开始时间和结束时间为', start, end);
        }
    });
}

// 总争议人数
ethUtil.getDisputeCount = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'flaggerSize',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('总争议人数为', myWeb3.eth.abi.decodeParameter('uint256', ret));
        }
    });
}

// 争议池金额
ethUtil.getDisputeAmount= function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'totalFlaggerDeposit',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('参与争议的金额为', myWeb3.utils.fromWei(myWeb3.eth.abi.decodeParameter('uint256', ret)));
        }
    });
}


// 参与争议的地址
ethUtil.getDisputeAddresses= function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'flaggerList',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('参与争议的地址为', myWeb3.eth.abi.decodeParameter('address[]', ret));
        }
    });
}

// 争议投票的开始时间和结束时间
ethUtil.flagVotingPeriod = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'votingPeriod',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            var timestamps = myWeb3.eth.abi.decodeParameters(['uint256', 'uint256'], ret);
            var start = new Date(timestamps[0] * 1000);
            var end = new Date(timestamps[1] * 1000);
            console.log('争议投票的开始时间和结束时间为', start, end);
        }
    });
}

// 争议陪审员投票
ethUtil.jurorVote = function (vote) {
    var decodeVote;
    if (vote === 'true' || vote === true) {
        decodeVote = true;
    } else {
        decodeVote = false;
    }

    console.log('decodeVote:', decodeVote, '  vote:', vote)

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'vote',
        type: 'function',
        inputs: [
            {
                type: 'address'
            },
            {
                type: 'bool'
            }
        ]
    }, [marketAddress, decodeVote]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('陪审员投票成功，交易hash为：', ret);
        }
    });
}

// 陪审员投票完成
ethUtil.jurorVoteDone = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'conclude',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('结束投票，交易hash为：', ret);
        }
    });
}

// 争议完结
ethUtil.disputeDone = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'closeFlagging',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('结束争议，交易hash为：', ret);
        }
    });
}

// 争议陪审员人数
ethUtil.getJurorSize = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'jurorSize',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('陪审员人数为', myWeb3.eth.abi.decodeParameter('uint256', ret));
        }
    });
}

// 争议陪审员列表
ethUtil.getJurorList = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'jurorList',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('陪审员列表为', myWeb3.eth.abi.decodeParameter('address[]', ret));
        }
    });
}

// 争议陪审员的投票
ethUtil.getJurorVotes = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'jurorVotes',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('陪审员投票列表为', myWeb3.eth.abi.decodeParameter('uint8[]', ret));
        }
    });
}

// 已上诉的次数
ethUtil.appealRound = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'appealRound',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('已投票的次数为', myWeb3.eth.abi.decodeParameter('uint8', ret));
        }
    });
}

// 上诉的开始时间和结束时间
ethUtil.appealingPeriod = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'appealingPeriod',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // call
    myWeb3.eth.call({
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            var timestamps = myWeb3.eth.abi.decodeParameters(['uint256', 'uint256'], ret);
            var start = new Date(timestamps[0] * 1000);
            var end = new Date(timestamps[1] * 1000);
            console.log('上诉的开始时间和结束时间为', start, end);
        }
    });
}

// 上诉
ethUtil.doAppeal = function () {
    var sutAmountWei = myWeb3.utils.toWei('2500');
    var extraData = '0x0000000000000000000000' + marketAddress.substr(2, 40) + '03';

    console.log('window.account', window.account)
    console.log('sutContractAddress', sutContractAddress)
    console.log('smartupContractAddress ', smartupContractAddress);
    console.log('sutAmountWei ', sutAmountWei);
    console.log('extraData ', extraData);

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'approveAndCall',
        type: 'function',
        inputs: [
            {
                type: 'address'
            },
            {
                type: 'uint256'
            },
            {
                type: 'bytes'
            }
        ]
    }, [smartupContractAddress,  sutAmountWei, extraData]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: sutContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('上诉成功，交易hash为：', ret);
        }
    });
}

// 解散市场
ethUtil.marketDissolve = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'dissolve',
        type: 'function',
        inputs: [
            {
                type: 'address'
            }
        ]
    }, [marketAddress]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: smartupContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('解散市场成功，交易hash为：', ret);
        }
    });
}

// ----------------------------------- 提案 ----------------------------------------------------

// 发起提案
ethUtil.doProposed = function (amount) {
    var amountWei = myWeb3.utils.toWei(amount);

    // console.log('amount:', amount, '  amountWei:', amountWei)

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'proposePayout',
        type: 'function',
        inputs: [
            {
                type: 'uint256'
            }
        ]
    }, [amountWei]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('发起提案成功，交易hash为：', ret);
        }
    });
}

// 当前提案的金额
ethUtil.getCurrentProposedAmount = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'proposedPayoutAmount',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('当前提案的金额为', myWeb3.utils.fromWei(myWeb3.eth.abi.decodeParameter('uint256', ret)));
        }
    });
}

// 总提案的金额
ethUtil.getProposedAmount = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'totalPaidSut',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('总提案的金额为', myWeb3.utils.fromWei(myWeb3.eth.abi.decodeParameter('uint256', ret)));
        }
    });
}

// 提案投票时间
ethUtil.proposedVotingPeriod = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'votingPeriod',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            var timeArr = myWeb3.eth.abi.decodeParameters(['uint256', 'uint256'], ret);
            var start = new Date(parseInt(timeArr[0]) * 1000)
            var end = new Date(parseInt(timeArr[1]) * 1000)
            console.log('提案投票时间为 ', start, " ~ ", end);
        }
    });
}

// 提案投票
ethUtil.doProposedVote = function (vote) {

    var decodeVote;
    if (vote === true || vote === 'true') {
        decodeVote = true
    } else {
        decodeVote = false
    }

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'vote',
        type: 'function',
        inputs: [
            {
                type: 'bool'
            }
        ]
    }, [decodeVote]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('提案投票成功，交易hash为：', ret);
        }
    });
}

// 查询提案陪审员
ethUtil.getProposedJurors = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'jurors',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('提案陪审员为', myWeb3.eth.abi.decodeParameter('address[]', ret));
        }
    });
}

// 查询提案陪审员的投票
ethUtil.getProposedVote = function() {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'jurorVotes',
        type: 'function',
        inputs: []
    }, []);

    // call
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('陪审员投票为', myWeb3.eth.abi.decodeParameter('uint8[]', ret));
        }
    });
}

// 投票完结
ethUtil.proposedVoteDone = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'conclude',
        type: 'function',
        inputs: []
    }, []);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: marketAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('提案投票完结，交易hash为：', ret);
        }
    });
}

//查询ct发行量
ethUtil.getCtTotoalSupply = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'totalSupply',
        type: 'function',
        inputs: []
    }, []);

    // transaction
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('ct 的发行量为：', myWeb3.utils.fromWei(ret));
        }
    });

}

//查询交易
ethUtil.getTransactionDetails = function (type, hash) {
    myWeb3.eth.getTransaction(hash, function(err,ret){
        if (err) {
            console.log(err);
        }else{
            console.log(ret)
        }
    })

    if (type === "1"){
        myWeb3.eth.getTransactionReceipt(hash, function(err,ret){
            if (err) {
                console.log(err);
            }else {
                if (ret.status === true) {
                    console.log("transaction success ", ret.status)
                }else{
                    console.log("transaction failed", ret.status)
                }
            }
        })
    }else if (type === "2"){

        myWeb3.eth.getTransactionReceipt(hash, function(err,ret){
            if (err) {
                console.log(err);
            }else {
                if (ret.status === true) {
                    console.log("transaction success ", ret.status)
                    var inputs = [{
                        type: 'address',
                        name: 'marketAddress'
                    },{
                        type: 'address',
                        name: 'marketCreator'
                    },{
                        type: 'uint256',
                        name: 'initialDeposit'
                    }]
                    var hexString = ret.logs[1].data
                    var topics = ret.logs[1].topics
                    var log = myWeb3.eth.abi.decodeLog(inputs, hexString, topics)
                    console.log("create market with ", myWeb3.utils.fromWei(log.initialDeposit,"ether"), "sut")
                }else{
                    console.log("transaction failed ", ret.status)
                }
            }
        })

    }else if (type === "3"){
        myWeb3.eth.getTransactionReceipt(hash, function(err,ret){
            if (err) {
                console.log(err);
            }else {
                if (ret.status === true) {
                    console.log("transaction success ", ret.status)
                    //BuyCt(address _ctAddress, address _buyer, uint256 _setSut, uint256 _costSut, uint256 _ct);
                    var inputs = [{
                        type: 'address',
                        name: '_ctAddress'
                    },{
                        type: 'address',
                        name: '_buyer'
                    },{
                        type: 'uint256',
                        name: '_setSut'
                    },{
                        type: 'uint256',
                        name: '_costSut'
                    },{
                        type: 'uint256',
                        name: '_ct'
                    }]
                    var hexString = ret.logs[1].data
                    var topics = ret.logs[1].topics
                    var log = myWeb3.eth.abi.decodeLog(inputs, hexString, topics)
                    console.log("set sut amount: ", myWeb3.utils.fromWei(log._setSut,"ether"))
                    console.log("cost sut amount: ", myWeb3.utils.fromWei(log._costSut,"ether"))
                    console.log("buy ct amount: ", myWeb3.utils.fromWei(log._ct,"ether"))
                }else{
                    console.log("transaction failed ", ret.status)
                }
            }
        })
    }else{
        myWeb3.eth.getTransactionReceipt(hash, function(err,ret){
            if (err) {
                console.log(err);
            }else {
                if (ret.status === true) {
                    console.log("transaction success ", ret.status)
                   // SellCt(address _ctAddress, address _sell, uint256 _sut, uint256 _ct);
                    var inputs = [{
                        type: 'address',
                        name: '_ctAddress'
                    },{
                        type: 'address',
                        name: '_sell'
                    },{
                        type: 'uint256',
                        name: '_sut'
                    },{
                        type: 'uint256',
                        name: '_ct'
                    }]
                    var hexString = ret.logs[1].data
                    var topics = ret.logs[1].topics
                    var log = myWeb3.eth.abi.decodeLog(inputs, hexString, topics)
                    console.log("sell ct ", myWeb3.utils.fromWei(log._ct,"ether"))
                    console.log("exchange sut ", myWeb3.utils.fromWei(log._sut,"ether"))
                }else{
                    console.log("transaction failed ", ret.status)
                }
            }
        })
    }


};


// ===================================== 平台升级 ===============================================


ethUtil.chargeSut = function(sut) {
    let sutWei = myWeb3.utils.toWei(sut + '');
    // encode function
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'approveAndCall',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: '_spender'
            },
            {
                type: 'uint256',
                name: '_value'
            },
            {
                type: 'bytes',
                name: '_extraData'
            }
        ]
    }, [exchangeContractAddress, sutWei, '0x0000000000000000000000000000000000000000000000000000000000000000']);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: sutContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('充值成功，交易hash为：', ret);
        }
    });

};

ethUtil.chargeEth = function(eth) {
    let ethWei = myWeb3.utils.toWei(eth + '');
    // encode function
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'depositEther',
        type: 'function',
        inputs: []
    }, []);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: exchangeContractAddress,
        value: ethWei,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('充值成功，交易hash为：', ret);
        }
    });

};

ethUtil.querySutInPlatform = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'tokenBalance',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'address',
                name: 'address'
            },
        ]
    }, [sutContractAddress, window.account]);

    // transaction
    myWeb3.eth.call({
        to: exchangeContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('存入的SUT余额为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.queryEthInPlatform = function () {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'tokenBalance',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'address',
                name: 'address'
            },
        ]
    }, ['0x0000000000000000000000000000000000000000', window.account]);

    // transaction
    myWeb3.eth.call({
        to: exchangeContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('存入的ETH余额为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.withdrawSut = function (sut) {
    let sutWei = myWeb3.utils.toWei(sut + '');
    // encode function
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'withdraw',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'uint256',
                name: 'amount'
            }
        ]
    }, [sutContractAddress, sutWei]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: exchangeContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('提取成功，交易hash为：', ret);
        }
    });
};

ethUtil.withdrawEth = function (eth) {
    let ethWei = myWeb3.utils.toWei(eth + '');
    // encode function
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'withdraw',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: 'token'
            },
            {
                type: 'uint256',
                name: 'amount'
            }
        ]
    }, ['0x0000000000000000000000000000000000000000', ethWei]);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: exchangeContractAddress,
        value: '0x0',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('提取成功，交易hash为：', ret);
        }
    });
};

// 签名
ethUtil.createMarketSign = function (sut, marketId, marketSymbol, ctCount, ctPrice, ctRecyclePrice, closingTime, gasLimit, gasPrice) {
    let sutWei = myWeb3.utils.toWei(sut + '');
    let ctCountWei = myWeb3.utils.toWei(ctCount + '');
    let ctPriceWei = myWeb3.utils.toWei(ctPrice + '');
    let ctRecyclePriceWei = myWeb3.utils.toWei(ctRecyclePrice + '');
    let gesFeeWei = (myWeb3.utils.toWei(gasPrice + '', "gwei") * gasLimit) + '';

    let hash = myWeb3.utils.soliditySha3(
        {type: 'address', value: account},
        {type: 'uint256', value: sutWei},
        {type: 'string', value: marketId},
        {type: 'string', value: marketSymbol},
        {type: 'uint256', value: ctCountWei},
        {type: 'uint256', value: ctPriceWei},
        {type: 'uint256', value: ctRecyclePriceWei},
        {type: 'uint256', value: gesFeeWei},
        {type: 'uint256', value: closingTime}
    );

    console.log("======================================================");
    console.log('name: ', marketId);
    console.log('symbol: ', marketSymbol);
    console.log('sutWei: ', sutWei);
    console.log('ctCountWei: ', ctCountWei);
    console.log('ctPriceWei: ', ctPriceWei);
    console.log('ctRecyclePriceWei: ', ctRecyclePriceWei);
    console.log('gesFeeWei: ', gesFeeWei);

    console.log('account: ', account);
    console.log('hash: ', hash);
    web3.personal.sign(hash, account, (err, ret) => {
        if (err) {
            console.log('err', err);
        } else {
            console.log('sign: ', ret);
        }
    });
};

ethUtil.queryMarketBalance = function(marketAddress) {

    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'tokenBalance',
        type: 'function',
        inputs: [
            {type: 'address', name: 'address'},
            {type: 'address', name: 'address'}
        ]
    }, [marketAddress, marketAddress]);

    myWeb3.eth.call({
        to: exchangeContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('第一阶段剩余CT为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.queryCtPrice = function(marketAddress) {
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'exchangeRate',
        type: 'function',
        inputs: []
    }, []);
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('第一阶段买入价格为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.queryCtRecyclePrice = function(marketAddress) {
    let data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'recycleRate',
        type: 'function',
        inputs: []
    }, []);
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('回收价格为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.queryMyCtCount = function(marketAddress) {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'tokenBalance',
        type: 'function',
        inputs: [
            {
                type: 'address',
                name: 'address'
            },
            {
                type: 'address',
                name: 'address'
            },
        ]
    }, [marketAddress, window.account]);

    // transaction
    myWeb3.eth.call({
        to: exchangeContractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log('我的CT数量为：', myWeb3.utils.fromWei(ret));
        }
    });
};

ethUtil.queryMarketStage = function(marketAddress) {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'isInFirstPeriod',
        type: 'function',
        inputs: []
    }, []);

    // transaction
    myWeb3.eth.call({
        to: marketAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err);
        } else {
            let isFirst = myWeb3.eth.abi.decodeParameter('bool', ret);
            console.log('当前市场阶段为：', isFirst? '第一阶段' : '第二阶段');
        }
    });
};

ethUtil.firstStageBuy = function (useAddress, marketAddress, ctCount, gasLimit, gasPrice, time) {
    let ctCountWei = myWeb3.utils.toWei(ctCount);
    let feeWei = (myWeb3.utils.toWei(gasPrice + '', "gwei") * gasLimit) + '';
    let timeHash = myWeb3.utils.sha3(time);

    console.log('ctCountWei = ', ctCountWei);
    console.log('feeWei = ', feeWei);
    console.log('time sha3 = ', timeHash);

    let hash = myWeb3.utils.soliditySha3(
        {type: "address", value: marketAddress},
        {type: "uint256", value: ctCountWei},
        {type: "address", value: useAddress},
        {type: "uint256", value: feeWei},
        {type: "bytes32", value: timeHash}
    );

    console.log('soliditySha3 hash = ', hash);

    web3.personal.sign(hash, account, (err, ret) => {
        if (err) {
            console.log('err', err);
        } else {
            console.log('sign: ', ret);
        }
    });
};

ethUtil.makeSign = function (type, marketAddress, sutAddress, price, volume, timestamp) {
    let volumeWei = myWeb3.utils.toWei(volume);
    let priceWei = myWeb3.utils.toWei(price);

    let hash = '';
    if (type === 'sell') {
        hash = myWeb3.utils.soliditySha3(
            {type: "uint256", value: volumeWei},
            {type: "uint256", value: priceWei},
            {type: "uint256", value: timestamp},
            {type: "address", value: marketAddress},
            {type: "address", value: sutAddress},
            {type: "address", value: window.account},
        );
    } else if (type === 'buy') {
        hash = myWeb3.utils.soliditySha3(
            {type: "uint256", value: volumeWei},
            {type: "uint256", value: priceWei},
            {type: "uint256", value: timestamp},
            {type: "address", value: sutAddress},
            {type: "address", value: marketAddress},
            {type: "address", value: window.account},
        );
    }

    console.log('volumeWei = ', volumeWei);
    console.log('priceWei = ', priceWei);
    console.log('account = ', window.account);
    console.log('hash = ', hash);

    web3.personal.sign(hash, account, (err, ret) => {
        if (err) {
            console.log('err', err);
        } else {
            console.log('trade sign: ', ret);
        }
    });
};

ethUtil.takeSign = function (type, volume, price, time, fee, marketAddress) {
    let volumeWei = myWeb3.utils.toWei(volume);
    let priceWei = myWeb3.utils.toWei(price);
    let feeWei = myWeb3.utils.toWei(fee, 'gwei');

    let sellAddress;
    let buyAddress;
    if (type === 'sell') {
        sellAddress = marketAddress;
        buyAddress = sutContractAddress;
    } else if (type === 'buy') {
        sellAddress = sutContractAddress;
        buyAddress = marketAddress;
    }

    let hash = myWeb3.utils.soliditySha3(
        {type: "uint256", value: volumeWei},
        {type: "uint256", value: priceWei},
        {type: "uint256", value: time},
        {type: "uint256", value: feeWei},
        {type: "address", value: sellAddress},
        {type: "address", value: buyAddress},
        {type: "address", value: window.account},
    );

    console.log('volumeWei = ', volumeWei);
    console.log('priceWei = ', priceWei);
    console.log('time = ', time);
    console.log('feeWei = ', feeWei);
    console.log('sellAddress = ', sellAddress);
    console.log('buyAddress = ', buyAddress);
    console.log('window.account = ', window.account);

    web3.personal.sign(hash, account, (err, ret) => {
        if (err) {
            console.log('err', err);
        } else {
            console.log('take sign: ', ret);
        }
    });
};

export {ethUtil}
