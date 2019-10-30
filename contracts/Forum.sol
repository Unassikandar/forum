pragma solidity ^0.5.0;

import "./ArgetherToken.sol";

contract Forum {
    // token contract instance variable
    ArgetherToken public tokenContract;
    uint256 public tokenPrice;
    address admin;

    // post object structure
    struct Post{
        uint256 postId;
        uint256 bid;
    }

    // new discussion event
    event NewPost(
        address indexed _owner,
        uint256 indexed _discussionId,
        uint256 indexed _postId,
        uint256 _bid
    );

    // map discussion id to the total pool of the discussion and the minimum bid
    mapping(uint => uint) poolOf;
    mapping(uint => uint) minBidOf;
    // track user posts
    mapping(address => Post[]) userPosts;
    // track user votes (user address to postId to vote value)
    mapping(address => mapping(uint => uint)) votesOf;


    constructor (ArgetherToken _tokenContract, uint256 _tokenPrice) public {
        // token contract
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        admin = msg.sender;
    }

    function newDiscussion(uint _discussionId, uint _minBid) public returns (bool success) {
        // ensure that pool is empty for new discussionId
        require(poolOf[_discussionId] == 0, 'new discussionId is invalid, pool is not empty');
        // check minimum bid
        require(_minBid > 0, 'Minimum bid must be greater than zero');
        // add discusionId to pool mapping
        poolOf[_discussionId] = _minBid;
        minBidOf[_discussionId] = _minBid;
        // return a boolean
        return true;
    }

    function addPost(uint256 _discussionId, uint256 _postId, uint256 _parentId, uint256 _bid) public payable returns (bool success) {
        // check if its a new discussion
        if(_parentId == 0){
            require(newDiscussion(_discussionId, _bid), 'new discussion creation');
        }
        // require that value is equal to tokens
        require(msg.value == multiply(_bid, tokenPrice), "check token multiplication");
        // require that bid >= minimum bid
        require(_bid >= minBidOf[_discussionId], 'bid should qualify for minimum bid');
        // require that poster has enough tokens
        require(tokenContract.balanceOf(msg.sender) >= _bid, 'user should have enough balance');
        // require that transfer is successful
        require(tokenContract.transferFrom(msg.sender, address(this), _bid), 'transfer should be successful');
        // create and add post
        Post memory newPost = Post({postId: _postId, bid: _bid});
        userPosts[msg.sender].push(newPost);
        // trigger newpost event
        emit NewPost(msg.sender, _discussionId, _postId, _bid);
        // return bool
        return true;
    }

    function multiply(uint x, uint y) public pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'multiplication check');
    }
}