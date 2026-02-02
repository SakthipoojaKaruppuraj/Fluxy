// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ZerobaseToken.sol";
import "../src/MonadToken.sol";

contract DeployTokens is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        ZerobaseToken zbt = new ZerobaseToken();
        MonadToken mnd = new MonadToken();

        vm.stopBroadcast();

        console.log("ZBT deployed at:", address(zbt));
        console.log("MND deployed at:", address(mnd));
    }
}
