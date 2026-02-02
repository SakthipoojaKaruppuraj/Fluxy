// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ZbtMndPool.sol";

contract DeployPool is Script {
    function run() external {
        uint256 key = vm.envUint("PRIVATE_KEY");

        address zbt = vm.envAddress("ZBT_TOKEN");
        address mnd = vm.envAddress("MND_TOKEN");

        vm.startBroadcast(key);

        // ✅ ONLY 2 arguments now
        ZbtMndPool pool = new ZbtMndPool(
            zbt,
            mnd
        );

        vm.stopBroadcast();

        console.log("Pool deployed at:", address(pool));
    }
}
