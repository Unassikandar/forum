const Forum = artifacts.require("Forum")
const ArgetherToken = artifacts.require("ArgetherToken")

contract('Forum', function(accounts) {
    var tokenInstance;
    var forumInstance, forumAddress;
    const tokenPrice = 1000000000000000;

    it('initializes forum with the proper admin address', function() {
        return ArgetherToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return Forum.deployed()
        }).then(function(instance) {
            forumInstance = instance;
            return forumInstance.admin();
        }).then(function(admin) {
            assert.equal(admin, accounts[0], 'Correctly initiallized with proper admin');
        });
    });

    it('can add a new post', function() {
        return ArgetherToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return Forum.deployed()
        }).then(function(instance) {
            forumInstance = instance;
            return forumInstance.addPost("1", "1", "0", 10, {from: accounts[0], value: 10*tokenPrice});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message should be a revert message');
            return forumInstance.address
        }).then(address => {
            forumAddress = address;
            return tokenInstance.approve(forumAddress, 10, {from: accounts[0]});
        }).then(recipt => {
            assert.equal(recipt.logs.length, 1, 'triggers one event');
            assert.equal(recipt.logs[0].event, "Approval", 'should be an approval event');
            return forumInstance.addPost("1", "1", "0", 10, {from: accounts[0], value: 10*tokenPrice});
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "NewPost", "should be a newPost event");
            return forumInstance.poolOf("1");
        }).then(pool => {
            assert.equal(pool, 10, 'pool value should be the initial bid => 10');
            return forumInstance.minBidOf("1");
        }).then(minBid => {
            assert.equal(minBid, 10, "minimum bid should be 10");
            return forumInstance.userPosts(accounts[0], 0);
        }).then(post => {
            assert.equal(post.postId, "1", 'postId should be 1');
            assert.equal(post.bid, 10, 'bid should be 10');
        });
    });

    it('users can upvote a post', function() {
        return ArgetherToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return Forum.deployed()
        }).then(function(instance) {
            forumInstance = instance;
            return forumInstance.poolOf("1")
        }).then(pool => {
            assert.equal(pool, 10, 'checking pool value');
            return tokenInstance.approve(forumAddress, 5, {from:accounts[0]});
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, "triggers one event");
            assert.equal(receipt.logs[0].event, "Approval", 'should be an approval event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'owner is the correct account');
            assert.equal(receipt.logs[0].args._spender, forumAddress, 'spender is the forum');
            assert.equal(receipt.logs[0].args._value, 5, 'approved amount is 5');
            return forumInstance.upvote("2", "1", {from: accounts[0], value: 5*tokenPrice});
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, 'error should be a revert');
            return forumInstance.upvote("1", "1", {from: accounts[0], value: 4*tokenPrice});
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, 'should revert because bid cost is false');
            return forumInstance.upvote("1", "1", {from: accounts[0], value: 5*tokenPrice});
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'should trigger one event');
            assert.equal(receipt.logs[0].event, "Vote", 'should be a vote event');
            return forumInstance.votesOf(accounts[0], "1");
        }).then(vote => {
            assert.equal(vote.toNumber(), 1 , 'votes of post should be 1');
            return forumInstance.upvote("1", "1", {from: accounts[0], value: 5*tokenPrice});
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, 'should revert because cannot upvote twice');
        });
    });
});