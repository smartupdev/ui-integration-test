import Web3 from 'web3';

var ethUtil = {}

// ropsten smartup 合约地址
// var contractAddress = '0x3ef4716f0a2456ac232034bb3898d41c2baa63ee';  
// 正式链 smartup 合约地址
// var contractAddress = '0x78f5bbc74fb9137a75d85f3c9c3c599be49f0a56';

// SUT：0xff06baccd44400a356ba64a9aba4d76cb1c99847
// Smartup：  0xb03aba8d576c499277f7e0946d55f30a07be39be
// Smartup_v2: 0x4a578e911ac8a00e4eae3c357b78b4c66aefc30e
// Smartup_v3: 0x8f06e2fdcedba35f5ec853b099ed32b87516e9d2
// Smartup_v4: 0x670a06f7a4306232f027a10bb90892f27f6b1208
// Smartup_v5: 0x764fc672d656c6c89899467eb242d65eea5f7f0a
// Smartup_v6: 0xbdfd50a794478ffb7c31fd8b3631e171e4f90949
// Smartup_v7: 0x5233fe9818f8296f8b89650162f55135876cb686
// Smartup_v8: 0x3f277470424e889a7c4a17c11cd190b28ba7b7c7
// Smartup_v9: 0x0fe210cce8343bfc93678d88de0a082c2bb3476f
// NTT：0xA01f5244B17b0D206903ac40A940FE981768090d

// const sutContractAddress = '0xff06baccd44400a356ba64a9aba4d76cb1c99847';
// const smartupContractAddress = '0x0fe210cce8343bfc93678d88de0a082c2bb3476f';

// ropsten
const sutContractAddress ='0xf1899c6eb6940021c1ae4e9c3a8e29ee93704b03';
//const smartupContractAddress = '0x58327b616e3a38c59c587e5166bb7531088ba0d5';
const smartupContractAddress = '0x251f33ffac9b764911b06dffc2e4a668db02288f';
const nttContractAddress = '0x846ce03199a759a183cccb35146124cd3f120548';

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


}




export {ethUtil}
