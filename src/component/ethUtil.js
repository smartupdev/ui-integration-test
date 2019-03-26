import Web3 from 'web3';

var ethUtil = {}

// ropsten smartup 合约地址
// var contractAddress = '0x3ef4716f0a2456ac232034bb3898d41c2baa63ee';  
// 正式链 smartup 合约地址
// var contractAddress = '0x78f5bbc74fb9137a75d85f3c9c3c599be49f0a56';

// 测试节合约地址
var contractAddress = '0xff06baccd44400a356ba64a9aba4d76cb1c99847';

// Smartup ： 0xb03aba8d576c499277f7e0946d55f30a07be39be
// SUT / SmartUp Token ? ：0xff06baccd44400a356ba64a9aba4d76cb1c99847
// NTT：0xA01f5244B17b0D206903ac40A940FE981768090d

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
                type: 'address',
                name: 'address'
            }
        ]
    }, ['0x1a3a50565eb671c08d607a4095761c6c6daaff5d']);

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
            console.log('创建市场成功，地址为：', ret);
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
            console.log('市场总交易SUT为：', ret)
        }
    });

}




export {ethUtil}