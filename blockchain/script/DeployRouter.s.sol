// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ZbtMndRouter.sol";

contract DeployRouter is Script {
    function run() external {
        uint256 key = vm.envUint("PRIVATE_KEY");

        address zbt = vm.envAddress("ZBT_TOKEN");
        address mnd = vm.envAddress("MND_TOKEN");
        address pool = vm.envAddress("POOL_ADDRESS");

        vm.startBroadcast(key);

        ZbtMndRouter router = new ZbtMndRouter(
            zbt,
            mnd,
            pool
        );

        vm.stopBroadcast();

        console.log("NEW Router deployed at:", address(router));
    }
}
