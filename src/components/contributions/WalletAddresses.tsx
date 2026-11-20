import { CopyWalletAddressButton } from './CopyWalletAddressButton';

interface WalletAddressesProps {
  bitcoinAddress: string;
  solanaAddress: string;
  campaignActive: boolean;
}

export function WalletAddresses({
  bitcoinAddress,
  solanaAddress,
  campaignActive,
}: WalletAddressesProps) {
  return (
    <section
      id="wallet-addresses"
      className="scroll-mt-6 border-y border-stone-200 bg-white py-6 sm:py-12"
      aria-labelledby="wallet-addresses-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-4 sm:mb-6 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-700">
            Direct wallet transfer
          </p>
          <h2
            id="wallet-addresses-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-charcoal-900 sm:text-3xl"
          >
            Send a contribution
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
            {campaignActive
              ? 'Choose Bitcoin or Solana. The wallet addresses are shown below and can be copied directly.'
              : 'These are the campaign wallet addresses. Contributions may be unavailable while the campaign is not active.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-charcoal-900">Bitcoin</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">BTC · Bitcoin network</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">BTC</span>
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Wallet address
            </p>
            <code className="mt-2 block w-full select-all break-all rounded-xl border border-stone-200 bg-white p-3 text-xs leading-6 text-charcoal-900 sm:text-sm">
              {bitcoinAddress}
            </code>

            <div className="mt-3">
              <CopyWalletAddressButton address={bitcoinAddress} label="Copy Bitcoin address" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              Send BTC on the Bitcoin network only. Do not send SOL or other assets to this address.
            </p>
          </article>

          <article className="min-w-0 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-charcoal-900">Solana</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">SOL · Solana mainnet</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">SOL</span>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Wallet address
            </p>
            <code className="mt-2 block w-full select-all break-all rounded-xl border border-stone-200 bg-white p-3 text-xs leading-6 text-charcoal-900 sm:text-sm">
              {solanaAddress}
            </code>

            <div className="mt-3">
              <CopyWalletAddressButton address={solanaAddress} label="Copy Solana address" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              Send native SOL on Solana mainnet only. Do not send BTC or tokens on another network here.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
