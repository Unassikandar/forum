// const Web3 = require('web3');
// const TruffleContract = require("truffle-contract");

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    accounts: null,
    tokensAvailable: 1000000,

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        if(typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3Providers.HttpProvider('http://localhost:7547');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("ArgetherToken.json", function(argetherToken) {
            App.contracts.ArgetherToken = TruffleContract(argetherToken);
            App.contracts.ArgetherToken.setProvider(App.web3Provider);
            App.contracts.ArgetherToken.deployed().then(function(argetherToken) {
                console.log("ArgetherToken address: ", argetherToken.address);
            });
            App.listenForEvents();
            return App.render();
        });
    },

    listenForEvents: function() {
        App.contracts.ArgetherToken.deployed().then(function(instance) {
            instance.Transfer({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event) {
                console.log("event triggered", event);
                App.render();
            })
        })
    },

    render: function() {
        // load account data
        web3.eth.getCoinbase(function(error, account) {
            if(error === null) {
                App.account = account;
                console.log("Admin account: " + account);
            } else {
                console.log("Error: getCoinbase()");
            }
        })

        web3.eth.getAccounts((err, acc) => { 
            if(err === null){
                App.accounts = acc;
                console.log("Accounts: " + acc);
            } else {
                console.log("Error fetching accounts");
            }
        })

        App.contracts.ArgetherToken.deployed().then(function(instance) {
            argetherToken = instance;
            return argetherToken.totalSupply();
        }).then(function(supply) {
            console.log("token supply: ", supply);
            $('#output').html(supply.toNumber());
            $('#output').show();
        });

        const button = document.getElementById('transfer');
        button.addEventListener('click', function(e) {
            console.log('button was clicked');
        });

    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});