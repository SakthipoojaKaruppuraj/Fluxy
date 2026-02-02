// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ZbtMndPool.sol";

contract ZbtMndRouter {
    IERC20 public immutable zbt;
    IERC20 public immutable mnd;
    ZbtMndPool public immutable pool;

    uint256 public totalVolume;

    constructor(address _zbt, address _mnd, address _pool) {
        zbt = IERC20(_zbt);
        mnd = IERC20(_mnd);
        pool = ZbtMndPool(_pool);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(amountIn > 0, "INVALID_INPUT");
        require(reserveIn > 0 && reserveOut > 0, "NO_LIQUIDITY");

        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }

    function swapExactTokensForTokens(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        require(
            tokenIn == address(zbt) || tokenIn == address(mnd),
            "INVALID_TOKEN"
        );

        IERC20(tokenIn).transferFrom(
            msg.sender,
            address(pool),
            amountIn
        );

        amountOut = pool.swap(tokenIn, amountIn, msg.sender);
        require(amountOut >= minAmountOut, "SLIPPAGE");

        totalVolume += amountIn;
    }
}
