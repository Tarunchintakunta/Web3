// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HealthStaking {
    // Staking details struct
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewards;
        bool isActive;
    }
    
    // Mapping of user address to their stake
    mapping(address => Stake) public stakes;
    
    // Rewards rate - 5% annually (expressed in basis points: 500 = 5%)
    uint256 public rewardsRate = 500;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 rewards);
    
    // Stake ETH function
    function stake() external payable {
        require(msg.value > 0, "Cannot stake 0 ETH");
        
        // Calculate rewards if user already has a stake
        if (stakes[msg.sender].isActive) {
            calculateRewards(msg.sender);
            stakes[msg.sender].amount += msg.value;
        } else {
            // Initialize new stake
            stakes[msg.sender] = Stake({
                amount: msg.value,
                timestamp: block.timestamp,
                rewards: 0,
                isActive: true
            });
        }
        
        emit Staked(msg.sender, msg.value);
    }
    
    // Calculate rewards based on time staked
    function calculateRewards(address user) public returns (uint256) {
        Stake storage userStake = stakes[user];
        
        if (!userStake.isActive) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - userStake.timestamp;
        uint256 rewards = (userStake.amount * rewardsRate * timeStaked) / (10000 * 365 days);
        
        userStake.rewards = rewards;
        return rewards;
    }
    
    // Withdraw staked ETH and rewards
    function withdraw() external {
        Stake storage userStake = stakes[msg.sender];
        
        require(userStake.isActive, "No active stake found");
        
        // Calculate final rewards
        calculateRewards(msg.sender);
        
        uint256 amountToWithdraw = userStake.amount;
        uint256 rewardsToWithdraw = userStake.rewards;
        
        // Reset user stake
        userStake.amount = 0;
        userStake.rewards = 0;
        userStake.isActive = false;
        
        // Transfer staked amount and rewards
        payable(msg.sender).transfer(amountToWithdraw + rewardsToWithdraw);
        
        emit Withdrawn(msg.sender, amountToWithdraw, rewardsToWithdraw);
    }
    
    // Get current stake info
    function getStakeInfo(address user) external view returns (uint256 amount, uint256 timestamp, uint256 rewards, bool isActive) {
        Stake memory userStake = stakes[user];
        return (userStake.amount, userStake.timestamp, userStake.rewards, userStake.isActive);
    }
}