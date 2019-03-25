import Web3 from 'web3';

var ethUtil = {}

// ropsten smartup 合约地址
var contractAddress = '0x3ef4716f0a2456ac232034bb3898d41c2baa63ee';  
// 正式链 smartup 合约地址
// var contractAddress = '0x78f5bbc74fb9137a75d85f3c9c3c599be49f0a56';


if (!window.web3) {
    alert('请先安装metamask');
}

// ropsten 测试节点 13.250.108.139
const myWeb3 = new Web3(web3.currentProvider);
// const myWeb3 = new Web3('http://13.250.108.139');
console.log('myWeb3 : ', myWeb3);

ethUtil.queryTest = function() {

    // encode function
    var data = myWeb3.eth.abi.encodeFunctionCall({
        name: 'balanceOf',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'address'
        }]
    }, ['0xb78f9b7Ea85dFaA2b03e5619BA9ca00b73A2c08D']);

    // call
    myWeb3.eth.call({
        to: contractAddress,
        data: data
    }, function (err, ret) {
        if (err) {
            console.log(err, ret);
        } else {
            console.log('账户余额为', myWeb3.utils.fromWei(ret));    
        }
    });

}

export {ethUtil}