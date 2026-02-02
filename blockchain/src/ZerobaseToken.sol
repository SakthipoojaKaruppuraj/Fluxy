// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
    ZEROBASE (ZBT)
    - Fully ERC20 compliant
    - Mintable (owner)
    - Burnable
    - Allowance management
    - DEX ready
*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZerobaseToken is ERC20, ERC20Burnable, Ownable {

    constructor()
        ERC20("ZEROBASE", "ZBT")
        Ownable(msg.sender)
    {}

    /*//////////////////////////////////////////////////////////////
                            MINTING
    //////////////////////////////////////////////////////////////*/

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                    ERC20 FUNCTIONS (INCLUDED)
    //////////////////////////////////////////////////////////////*/

    /*
        transfer(address to, uint256 amount)
        approve(address spender, uint256 amount)
        transferFrom(address from, address to, uint256 amount)
        allowance(address owner, address spender)
        balanceOf(address account)
        totalSupply()
        burn(uint256 amount)
        burnFrom(address account, uint256 amount)
        increaseAllowance(address spender, uint256 addedValue)
        decreaseAllowance(address spender, uint256 subtractedValue)
    */

}
