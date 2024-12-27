# Poor Token (POOR) ERC20 Implementation 💰

A fee-based ERC20 token implementation with minting mechanism and fixed supply. Built for learning and demonstration purposes with a focus on simplicity and security.

## 🌟 Features

- Fee-based minting (0.01 ETH)
- Fixed initial supply (1,000,000 POOR)
- Standard ERC20 functionality
- Deflationary mechanism
- Gas optimized implementation

## 🔗 Contract Information

- **Network**: Sepolia Testnet
- **Contract Address**: `0x25f6af50c4B2ac2a9eE34881294b8BBcdb8b4fAF` [View on Etherscan](https://sepolia.etherscan.io/address/0x25f6af50c4B2ac2a9eE34881294b8BBcdb8b4fAF#code)
- **Token Symbol**: POOR
- **Decimals**: 18
- **Initial Supply**: 1,000,000 POOR

## 🛠 Technical Specifications

### Token Economics

```solidity
Initial Supply: 1,000,000 POOR
Minting Fee: 0.01 ETH
Decimals: 18
```

### Core Functions

- `mint()` - Mint new tokens (requires 0.01 ETH)
- `transfer(address to, uint256 value)` - Transfer tokens
- `approve(address spender, uint256 value)` - Approve spending
- `transferFrom(address from, address to, uint256 value)` - Transfer approved tokens

## 🔒 Security Features

1. Balance Checks

   - Sufficient balance validation
   - Allowance verification
   - Fee validation

2. Authorization

   - Sender verification
   - Allowance tracking
   - Owner permissions

3. Supply Management
   - Fixed initial supply
   - Deflationary minting
   - Balance tracking

## 📦 Installation & Deployment

This contract was deployed using Hardhat and Ignition. For detailed deployment instructions, check our [Smart Contract Deployment Guide](https://gist.github.com/All-Khwarizmi/ce94a819bd28fb301a46e6d98eadec8c).

### Quick Start

```bash
# Install dependencies
npm install

# Deploy contract
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 🎯 Design Decisions

1. Token Model

   - Fixed initial supply
   - Deflationary through minting
   - Fee-based minting mechanism

2. Storage Layout

   - Optimized mappings
   - Constant state variables
   - Gas efficient storage

3. Error Handling
   - Custom error types
   - Clear error messages
   - Comprehensive checks

## 📊 Events

Standard ERC20 events:

- `Transfer(address from, address to, uint256 value)`
- `Approval(address owner, address spender, uint256 value)`
- `Mint(address indexed owner, uint256 tokenId)`

## 🧪 Testing

```bash
# Run test suite
npx hardhat test

# Check coverage
npx hardhat coverage
```

## 🔍 Contract Verification

The contract is verified on Etherscan with:

- Solidity Version: 0.8.28
- Optimizer: Enabled
- License: Custom (See LICENSE)

## 💡 Use Cases

1. Learning & Education

   - ERC20 implementation study
   - Token economics exploration
   - Smart contract development practice

2. Testing & Development
   - DeFi protocol testing
   - Wallet integration testing
   - dApp development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

See LICENSE file in repository.

## 📞 Contact

For any questions or feedback, please open an issue or reach out through:

- Email:contact@jason-suarez.com
- Twitter: [@swarecito](https://twitter.com/swarecito)
