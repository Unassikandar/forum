pragma solidity ^0.5.0;

import "./ArgetherToken.sol";

contract Forum {
    // token contract instance variable
    ArgetherToken public tokenContract;
    uint256 public tokenPrice;
    uint public voteBid;
    address public admin;

    // post object structure
    struct Post{
        string postId;
        uint256 bid;
    }

    // new discussion event
    event NewPost(
        address indexed _owner,
        string indexed _discussionId,
        string indexed _postId,
        uint256 _bid
    );
    // vote event
    event Vote(
        address indexed _user,
        string indexed _postId
    );

    // map discussion id to the total pool of the discussion and the minimum bid
    mapping(string => uint) public poolOf;
    mapping(string => uint) public minBidOf;
    // track user posts
    mapping(address => Post[]) public userPosts;
    // track user votes (user address to postId to vote value)
    mapping(address => mapping(string => uint)) public votesOf;


    constructor (ArgetherToken _tokenContract, uint256 _tokenPrice) public {
        // token contract
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
        voteBid = 5;
        admin = msg.sender;
    }

    function newDiscussion(string memory _discussionId, uint _minBid) public returns (bool success) {
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

    function addPost(string memory _discussionId, string memory _postId,
                                    string memory _parentId, uint256 _bid) public payable returns (bool success) {
        // check if its a new discussion
        if(compareStringsbyBytes(_parentId, "0")){
            require(newDiscussion(_discussionId, _bid), 'new discussion creation');
        }
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

    // to upvote a user has to bid 5
    function upvote(string memory _discussionId, string memory _postId) public payable returns (bool success) {
        // make sure that bid == 5
        require(msg.value == multiply(5, tokenPrice), 'check whether bid cost is covered');
        // require that voter has enough balance
        require(tokenContract.balanceOf(msg.sender) >= 5, 'user should have a balance of at least 5');
        // require that the transfer of tokens is successful
        require(tokenContract.transferFrom(msg.sender, address(this), 5), 'transfer should be successful user -> contract');
        // check that the post is not already upvoted by the user
        require(votesOf[msg.sender][_postId] != 1, 'user has already upvoted the post');
        // check if the disId is valid
        require(poolOf[_discussionId] != 0, 'should be a valid discussion id');
        // create the vote
        votesOf[msg.sender][_postId] = 1;
        // add bid to the discussion pool
        poolOf[_discussionId] += 5;
        // trigger vote event
        emit Vote(msg.sender, _postId);
        // return bool
        return true;
    }


    function multiply(uint x, uint y) public pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'multiplication check');
    }

    function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool){
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
}