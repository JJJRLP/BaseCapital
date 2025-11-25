'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';

export function WalletConnect() {
    return (
        <div className="flex justify-end">
            <Wallet>
                <ConnectWallet className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white hover:bg-zinc-900 hover:border-[var(--color-gold)] transition-all duration-300 px-6 py-2.5 rounded-none font-light tracking-wide">
                    <Avatar className="h-6 w-6" />
                    <Name className="text-sm font-light" />
                </ConnectWallet>
                <WalletDropdown className="bg-[#0a0a0a] border border-zinc-800 rounded-none mt-2">
                    <Identity
                        className="px-4 pt-3 pb-2 hover:bg-zinc-900 transition-colors"
                        hasCopyAddressOnClick
                    >
                        <Avatar />
                        <Name className="text-white" />
                        <Address className="text-zinc-500" />
                        <EthBalance className="text-[var(--color-gold)]" />
                    </Identity>
                    <WalletDropdownDisconnect className="hover:bg-red-900/20 text-red-500 transition-colors" />
                </WalletDropdown>
            </Wallet>
        </div>
    );
}
