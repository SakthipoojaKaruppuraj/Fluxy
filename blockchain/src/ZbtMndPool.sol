// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
    ZBT–MND Constant Product AMM Pool
    --------------------------------
    - x * y = k pricing
    - Router-only swaps
    - Router can be set ONCE (permanent fix)
*/

contract ZbtMndPool {
    IERC20 public immutable zbt;
    IERC20 public immutable mnd;

    address public router;
    bool public routerInitialized;

    uint256 private reserveZbt;
    uint256 private reserveMnd;

    modifier onlyRouter() {
        require(msg.sender == router, "ONLY_ROUTER");
        _;
    }

    constructor(address _zbt, address _mnd) {
        require(_zbt != address(0), "ZBT_ZERO");
        require(_mnd != address(0), "MND_ZERO");

        zbt = IERC20(_zbt);
        mnd = IERC20(_mnd);
    }

    /*//////////////////////////////////////////////////////////////
                        ROUTER INITIALIZATION
    //////////////////////////////////////////////////////////////*/

    function setRouter(address _router) external {
        require(!routerInitialized, "ROUTER_ALREADY_SET");
        require(_router != address(0), "ROUTER_ZERO");

        router = _router;
        routerInitialized = true;
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW
    //////////////////////////////////////////////////////////////*/

    function getReserves()
        external
        view
        returns (uint256, uint256)
    {
        return (reserveZbt, reserveMnd);
    }

    /*//////////////////////////////////////////////////////////////
                            SWAP
    //////////////////////////////////////////////////////////////*/

    function swap(
        address tokenIn,
        uint256 amountIn,
        address to
    ) external onlyRouter returns (uint256 amountOut) {
        require(amountIn > 0, "INVALID_AMOUNT");
        require(to != address(0), "INVALID_TO");

        bool isZbtIn = tokenIn == address(zbt);
        require(isZbtIn || tokenIn == address(mnd), "INVALID_TOKEN");

        (uint256 rIn, uint256 rOut) = isZbtIn
            ? (reserveZbt, reserveMnd)
            : (reserveMnd, reserveZbt);

        require(rIn > 0 && rOut > 0, "NO_LIQUIDITY");

        // x * y = k
        amountOut = (amountIn * rOut) / (rIn + amountIn);
        require(amountOut > 0, "ZERO_OUTPUT");

        if (isZbtIn) {
            mnd.transfer(to, amountOut);
            reserveZbt = rIn + amountIn;
            reserveMnd = rOut - amountOut;
        } else {
            zbt.transfer(to, amountOut);
            reserveMnd = rIn + amountIn;
            reserveZbt = rOut - amountOut;
        }
    }

    /*//////////////////////////////////////////////////////////////
                        LIQUIDITY SYNC
    //////////////////////////////////////////////////////////////*/

    function sync() external {
        reserveZbt = zbt.balanceOf(address(this));
        reserveMnd = mnd.balanceOf(address(this));
    }
}
