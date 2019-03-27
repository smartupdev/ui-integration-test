import Web3 from 'web3';

var ethUtil = {}

// ropsten smartup 合约地址
// var contractAddress = '0x3ef4716f0a2456ac232034bb3898d41c2baa63ee';  
// 正式链 smartup 合约地址
// var contractAddress = '0x78f5bbc74fb9137a75d85f3c9c3c599be49f0a56';

// SUT = SmartUp Token ：0xff06baccd44400a356ba64a9aba4d76cb1c99847
// Smartup ： 0xb03aba8d576c499277f7e0946d55f30a07be39be
// NTT：0xA01f5244B17b0D206903ac40A940FE981768090d

var sutContractAddress = '0xff06baccd44400a356ba64a9aba4d76cb1c99847';
var smartupContractAddress = '0xb03aba8d576c499277f7e0946d55f30a07be39be';

if (!window.web3) {
    alert('请先安装metamask');
}


const myWeb3 = new Web3(web3.currentProvider);
// console.log('myWeb3 : ', myWeb3);


// 市场地址 0x2af8209a2131c8c1e00e461faa206820f8b5d9ba
var marketAddress = '';

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
        to: '0xff06baccd44400a356ba64a9aba4d76cb1c99847',
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('SUT余额为', myWeb3.utils.fromWei(ret));    
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
    }, ['0xb03aba8d576c499277f7e0946d55f30a07be39be', '2500000000000000000000', '0x0000000000000000000000000000000000000000000000000000000000000001']);

    // transaction
    myWeb3.eth.sendTransaction({
        from: window.account,
        to: '0xff06baccd44400a356ba64a9aba4d76cb1c99847',
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
        to: '0xb03aba8d576c499277f7e0946d55f30a07be39be',
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

ethUtil.isTradeEnabled = function() {
    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'tradeEnabled',
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
            console.log('市场是否可以交易:', myWeb3.eth.abi.decodeParameter('bool', ret));
        }
    });
}

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



ethUtil.bidCt = function (ctPrice, ctAmount) {

    var val = myWeb3.eth.abi.encodeParameter('bytes32', 5);
    console.log(val)

    // 买入CT approveAndCall
    // 调用SUT合约地址
    // 参数 CT地址， quote价格*1.1，CT数量 

    // console.log('ctPrice:', ctPrice, '  ctAmount:', ctAmount)

    // var decodeCtPrice = myWeb3.utils.toWei(ctPrice);
    // var decodeCtAmount = myWeb3.eth.abi.encodeParameter('uint256', ctAmount);
    // console.log('decodeCtPrice:', decodeCtPrice, '  decodeCtAmount:', decodeCtAmount)

    // // encode function
    // var data = myWeb3.eth.abi.encodeFunctionCall({
    //     name: 'approveAndCall',
    //     type: 'function',
    //     inputs: [
    //         {
    //             type: 'address',
    //             name: '_spender'
    //         },
    //         {
    //             type: 'uint256',
    //             name: '_value'
    //         },
    //         {
    //             type: 'bytes',
    //             name: '_extraData'
    //         }
    //     ]
    // }, [marketAddress, decodeCtPrice, '0x0000000000000000000000000000000000000000000000000000000000000004']);

    // // transaction
    // myWeb3.eth.sendTransaction({
    //     from: window.account,
    //     to: smartupContractAddress,
    //     value: '0x0',
    //     data: data
    // }, function (err, ret) {
    //     if (err) {
    //         console.log(err, ret);
    //     } else {
    //         console.log('购买成功，交易hash为：', ret);
    //     }
    // });
}


export {ethUtil}