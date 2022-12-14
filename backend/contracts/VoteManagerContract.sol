//SPDX-License-Identifier: Unlicense
//specific solidity cersion
pragma solidity ^0.8.17;
// we can use the console.log func from hardhat for debugging (like in javascript)
import "hardhat/console.sol";

// openzeppelin provides libaries of different use cases, this one provides a counter with best practices 
// a simple way to get a counter that can only be incremented or decremented. Very useful for ID generation, counting contract activity, among others.
import "@openzeppelin/contracts/utils/Counters.sol";

contract VoteManagerContract {

    struct Candidate {
        uint id;
        uint totalVote;
        string name;
        string imageHash;
        address candidateAddress;
    }
    // this is how to define a enum, the values are defined in the {}
    enum VoteManagerEnum{CREATED, OPEN, CLOSED}

    // a struct is like a class but without any implementation logic
    struct AccountInfo {
        uint id;
        string name;
        address accountAddress;
    }
    //  Functions in a library can be used by many contracts. If you have many contracts that have some common code, then you can deploy that common code as a library.
    // The directive using A for B; can be used to attach library functions of library A to a given type B. These functions will used the caller type as their first parameter (identified using self).
    using Counters for Counters.Counter;
    Counters.Counter private candidatesIds;

    // mapping (technically a hashtable) stores keys to values (key => value) good for association topics
    // this mapping is used to keep track of the ids (number) to the right account address (hash)
    mapping(address => Candidate) private candidates;
    mapping(uint=> address) private accounts;

    // an event is used to let other parties know that something important has happend in your contract
    // other contracts or event frontends can subscribe to your events
    event accountCreatedEvent(address indexed accountAddress, string name);
    event candidateCreated(address indexed canditateAddress, string name);
    event Voted(address indexed _candidateAddress, address indexed _voterAddress, uint _totalVote);

    function registerCandidate(string calldata _name, string calldata _imageHash) external {
        require(msg.sender != address(0), "Sender address must be valid"); 
        candidatesIds.increment();
        uint candidateId = candidatesIds.current();
        address _address = address(msg.sender);
        Candidate memory newCandidate = Candidate(candidateId, 0, _name, _imageHash, _address);  
        candidates[_address] = newCandidate;  
        accounts[candidateId] = msg.sender;
        emit candidateCreated(_address, _name);
    }

    function vote(address _forCandidate) external {
        candidates[_forCandidate].totalVote += 1;
        emit Voted(_forCandidate, msg.sender, candidates[_forCandidate].totalVote);
    }

    function fetchCandidates() external  view  returns ( Candidate[] memory) {
        uint itemCount = candidatesIds.current();
        Candidate[] memory candidatesArray = new Candidate[](itemCount);
            for (uint i = 0; i < itemCount; i++) {
                uint currentId = i + 1;
                Candidate memory currentCandidate = candidates[accounts[currentId]];
                candidatesArray[i] = currentCandidate;
            }
        return candidatesArray;
    }
}
