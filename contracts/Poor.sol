// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import "./ERC20.sol";

contract Poor is IERC20 {
    string private constant NAME = "PoorToken";

    string private constant SYMBOL = "POOR";

    uint8 private constant DECIMALS = 18;

    uint256 public constant INITIAL_SUPPLY = 1000000 * 10 ** uint(DECIMALS);

    uint256 public totalSupply = INITIAL_SUPPLY;

    uint256 public constant FEE = 0.01 ether;

    mapping(address owner => uint256 balance) public balanceOf;

    mapping(address owner => mapping(address spender => uint256 remaining))
        public amount;

    event Mint(address indexed owner, uint256 tokenId);

    error NotEnoughSupply();
    error NotEnoughValue();
    error NotAuthorized(address account);

    function name() external pure returns (string memory) {
        return NAME;
    }

    function decimals() external pure returns (uint8) {
        return DECIMALS;
    }

    function symbol() external pure returns (string memory) {
        return SYMBOL;
    }

    /// @param owner  The address of the account owning tokens
    /// @param spender  The address of the account able to transfer the tokens
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256 remaining) {
        uint256 _remaining = amount[owner][spender];
        return _remaining;
    }

    /// @notice Mints a new Token
    /// @dev Requires payment of FEE, reduces totalSupply
    function mint() external payable {
        if (msg.value != FEE) {
            revert NotEnoughValue();
        }

        uint256 currentSupply = totalSupply;
        if (currentSupply < 1) {
            revert NotEnoughSupply();
        }

        totalSupply -= 1;

        balanceOf[msg.sender] += 1;

        emit Transfer(address(0), msg.sender, msg.value);
    }

    /// @notice Approves `spender` to spend `value` on behalf of the `msg.sender`
    /// @param spender The address which will spend the funds
    /// @param value The amount of tokens to be spent
    function approve(
        address spender,
        uint256 value
    ) external returns (bool success) {
        // Sets (or overrides if called multiple times) the `value` the `spender` is allowed to spend on behalf or the `msg.sender`.
        amount[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    /// @notice Transfers `value` tokens from the `msg.sender` to the `to` address
    /// @param to The address to transfer to
    /// @param value The amount to be transferred
    function transfer(
        address to,
        uint256 value
    ) external returns (bool success) {
        if (balanceOf[msg.sender] < value) revert NotEnoughValue();

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    /// @notice Transfers `value` tokens from the `from` address to the `to` address
    /// @param from The address to transfer from
    /// @param to The address to transfer to
    /// @param value The amount to be transferred
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool success) {
        bool isOwner = msg.sender == from;
        if (!isOwner && amount[from][msg.sender] == 0)
            revert NotAuthorized(msg.sender);

        if (balanceOf[from] < value) revert NotEnoughValue();

        if (!isOwner) {
            require(
                amount[from][msg.sender] >= value,
                "Account not allowed to withdraw this amount"
            );
            amount[from][msg.sender] -= value;
        }

        balanceOf[from] -= value;
        balanceOf[to] += value;

        emit Transfer(from, to, value);

        return true;
    }
}
