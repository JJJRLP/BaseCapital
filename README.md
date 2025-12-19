# Base Capital

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-beta-orange.svg)
![Base](https://img.shields.io/badge/network-Base-blue)

**The first decentralized proprietary trading firm built natively on Base.**

Base Capital democratizes access to trading capital. We provide an infrastructure where traders can prove their skills and access firm capital through smart contract-enforced risk management. No banking friction, instant USDC payouts, and completely transparent on-chain execution.

## 🚀 Key Features

- **Instant USDC Payouts**: 80/20 profit split settled automatically on-chain.
- **Smart Wallet Integration**: Seamless login with Coinbase Smart Wallet (Passkeys) - no seed phrases required.
- **On-Chain Risk Management**: `RiskManager.sol` enforces drawdown limits and position sizing in real-time.
- **Capital Isolation**: Each funded trader operates through a dedicated `TraderAccount.sol` smart wallet.
- **Whitelisted DeFi Trading**: Execute trades on premier DEXs like Aerodrome and Uniswap directly.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS
- **Blockchain**: Base (L2), Solidity, Foundry
- **Connectors**: OnchainKit, Wagmi, Viem
- **Backend/DB**: Supabase (PostgreSQL), Prisma ORM

## 🏁 Getting Started

Follow these steps to set up the project locally for development.

### Prerequisites

- **Node.js** (v18+)
- **npm** or **pnpm**
- **Foundry** (for smart contract development)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/base-capital.git
   cd base-capital
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the sample environment file and configure your keys.
   ```bash
   cp env.sample .env
   ```
   *You will need keys for Supabase, Coinbase Developer Platform (for OnchainKit), and a database URL.*

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌊 Usage Flows

### For Traders

1. **Connect Wallet**: Use Coinbase Smart Wallet to create a passkey account or connect an existing EOA.
2. **Select a Challenge**: Choose a funding tier (Starter $5k, Professional $25k, etc.) and pay the one-time fee in USDC.
3. **Trading Phase**:
    - **Challenge**: Trade on the testnet simulation to prove profitability (8% target) without exceeding drawdown (8% max loss).
    - **Verification**: Repeat to confirm consistency.
4. **Get Funded**: Upon passing, a `TraderAccount` smart wallet is deployed and funded with real USDC.
5. **Live Trading**: Trade approved assets on whitelisted DEXs.
6. **Withdraw Profits**: Request a payout via the dashboard. The `Treasury` contract validates equity and sends 80% of profits to your wallet instantly.

### For Developers

- **Smart Contracts**: navigate to `/contracts` to access the Foundry environment.
    - Run tests: `forge test`
    - Deploy: see [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- **Database**: We use Prisma with Supabase.
    - Update schema: `npx prisma db push`
    - Generate client: `npx prisma generate`

## 🔐 Security

Security is our top priority. Our architecture minimizes trust assumptions:

- **Non-Custodial for Firm**: Traders cannot withdraw principal.
- **Non-Custodial for Traders**: Firm cannot size profits arbitrarily; splits are hardcoded.
- **Risk Enforcement**: Automated by Chainlink Keepers via `RiskManager.sol`.

For full details on our security model and how to report vulnerabilities, please read [SECURITY.md](./SECURITY.md).

> **Note**: This codebase currently includes a standard MIT License. Usage of the software is at your own risk.

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for the full list of contributors.

---

## 👥 Ownership & Development

**Base Capital** is developed and maintained by [Jhonny R. Lopez from Skylos](https://skylos.solutions)** - a Custom AI Solutions and Blockchain Development Agency.

### Core Contributors

| Name | Role | Contact |
|------|------|---------|
| Jhonny R. Lopez Pommier | COO & Business Strategist | [Skylos](https://skylos.solutions) (jhonny.r.lopz@gmail.com) |
| Andres Barriga | Contributor | - |

For business inquiries: [agency@skylos.solutions](mailto:agency@skylos.solutions)

