App = {

    web3Provider: null,
    contracts: {},
    account: '0x0',
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

        // checking total token supply (on console)
        App.contracts.ArgetherToken.deployed().then(function(instance) {
            argetherToken = instance;
            return argetherToken.balanceOf(App.account);
        }).then(function(supply) {
            console.log("token supply: ", supply);
            $('#output').html(supply.toNumber());
            $('#output').show();
        });
        
        
        // fetching all posts using the transfer button (on console)
        const button = document.getElementById('transfer');
        button.addEventListener('click', function(e) {
            console.log('button was clicked');
            // pos.fetchPosts();
            // pos.addPost({disId: "5d83411a1f5c5138f9a0a73b", parId: "0", owner: "0x00", content: "xxxxxx"});
            pos.addPost("5d83411a1f5c5138f9a0a73b", "0", "0x00", "xxxxxx");

        });

    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});