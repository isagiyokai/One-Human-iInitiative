# Payment Setup Guide

Configuration guide for all four contribution methods.

## Overview

The One Human Initiative supports four contribution methods:

1. **Bitcoin (BTC)** - On-chain transactions
2. **Solana (SOL)** - Fast, low-fee transactions
3. **Phantom Username** - Human-readable wallet addresses
4. **Ko-fi** - Traditional payment methods (requires approval)

All payment addresses are configured via **Admin Dashboard > Payment Settings**.

## Bitcoin (BTC)

### Address Format

Supported formats:
- **Bech32 (Native SegWit)**: `bc1q...` (recommended)
- **Legacy (P2PKH)**: `1...`
- **SegWit (P2SH)**: `3...`

### Configuration

1. Go to **Admin > Payments**
2. Enter Bitcoin address in the Bitcoin section
3. Address validated client and server-side
4. Click **Save Payment Settings**

### Verification Process

1. Supporter sends BTC to address
2. Supporter submits transaction hash (64-char hex)
3. Admin verifies on blockchain explorer:
   - [Blockstream](https://blockstream.info)
   - [Mempool.space](https://mempool.space)
   - [Blockchain.com](https://blockchain.com)
4. Admin checks:
   - Correct receiving address
   - Sufficient confirmations (1+ recommended)
   - Amount matches submission
5. Admin clicks **Verify** or **Reject**

### Best Practices

- Use a **dedicated address** for this campaign
- Consider **hardware wallet** for large amounts
- **Test with small amount** before going live
- Monitor for **dust attacks** (tiny unwanted UTXOs)
- **Never reuse addresses** for other purposes

### Common Issues

| Issue | Solution |
|-------|----------|
| Invalid address format | Ensure Bech32 (bc1) or Legacy (1/3) |
| Transaction not found | Wait for mempool propagation |
| Wrong amount | Supporter must send exact amount |
| Low confirmations | Wait for 1+ confirmations |

## Solana (SOL)

### Address Format

- **Base58 encoded public key**: 32-44 characters
- Example: `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAtU`

### Configuration

1. Go to **Admin > Payments**
2. Enter Solana address in the Solana section
3. Address validated (base58, length)
4. Click **Save Payment Settings**

### Verification Process

1. Supporter sends SOL to address
2. Supporter submits transaction signature (88-90 chars base58)
3. Admin verifies on Solana explorer:
   - [Solscan](https://solscan.io)
   - [Solana Explorer](https://explorer.solana.com)
   - [SolanaFM](https://solana.fm)
3. Admin checks:
   - Correct receiving address
   - Status: Success
   - Amount matches (in lamports: 1 SOL = 1,000,000,000 lamports)
4. Admin clicks **Verify** or **Reject**

### Best Practices

- Use **dedicated wallet** for campaign
- **Test with devnet** first if new to Solana
- Consider **priority fees** for faster confirmation
- **Verify SPL token** if not native SOL (should be SOL only)

### Common Issues

| Issue | Solution |
|-------|----------|
| Invalid signature format | Must be base58, 88-90 chars |
| Transaction failed | Check status on explorer |
| Wrong amount | Convert lamports to SOL (divide by 1e9) |
| SPL token sent | Only accept native SOL |

## Phantom Username

### Overview

Phantom usernames are human-readable identifiers for Phantom wallet users (e.g., `@onehumaninitiative`).

### Configuration

1. Go to **Admin > Payments**
2. Enter Phantom username (must start with `@`)
3. Username validated client and server-side
4. Click **Save Payment Settings**

### How It Works

1. Supporter opens Phantom wallet
2. Enters `@onehumaninitiative` as recipient
3. Sends SOL (or SPL tokens)
4. Submits transaction signature
5. Admin verifies as normal Solana transaction

### Verification

Same as Solana verification - check transaction on explorer for:
- Recipient resolves to correct public key
- Amount matches
- Status: Success

### Best Practices

- **Claim username** early on Phantom
- **Verify ownership** before configuring
- **Test with small amount** first
- Username **cannot be changed** once claimed

### Common Issues

| Issue | Solution |
|-------|----------|
| Username not found | Must be claimed on Phantom first |
| Resolves to wrong key | Verify ownership on Phantom |
| Invalid format | Must start with @, alphanumeric/underscore |

## Ko-fi

### Overview

Ko-fi provides traditional payment methods (cards, PayPal, etc.) but requires platform approval.

### Prerequisites

1. Create Ko-fi account at [ko-fi.com](https://ko-fi.com)
2. Set up Ko-fi page
3. **Apply for Ko-fi Gold** (required for API/commission-free)
4. Wait for approval (can take days/weeks)

### Configuration

1. Go to **Admin > Payments**
2. Enable **Ko-fi** toggle
3. Enter:
   - **Ko-fi URL**: Your Ko-fi page (e.g., `https://ko-fi.com/onehumaninitiative`)
   - **Button Label**: Display text (default: "Support on Ko-fi")
   - **Status**: Set to `active` after approval
4. Click **Save Payment Settings**

### Verification Process

**Option A: Manual (Default)**
1. Supporter donates on Ko-fi
2. Supporter submits Ko-fi transaction ID
3. Admin verifies on Ko-fi dashboard
4. Admin clicks **Verify** or **Reject**

**Option B: Webhook (Future Enhancement)**
- Ko-fi webhook notifies API of new donations
- Auto-creates pending contribution
- Admin still verifies

### Ko-fi Fees

| Plan | Platform Fee | Payment Processor Fee |
|------|--------------|----------------------|
| Free | 5% | Stripe/PayPal fees |
| Gold | 0% | Stripe/PayPal fees |

### Best Practices

- **Get Gold approved** before enabling
- **Test donations** with small amounts
- **Match Ko-fi settings** to campaign (no rewards, no tiers)
- **Document fees** on transparency page

### Common Issues

| Issue | Solution |
|-------|----------|
| "Not currently available" | Enable toggle and set status to active |
| Invalid URL | Must be ko-fi.com domain |
| Webhook not working | Verify webhook URL in Ko-fi settings |
| Fees unclear | Document on transparency page |

## Testing Checklist

Before going live, test each method:

### Bitcoin Test
- [ ] Address valid format
- [ ] QR code scans correctly
- [ ] Test transaction (small amount)
- [ ] Transaction appears on explorer
- [ ] Admin can verify in dashboard

### Solana Test
- [ ] Address valid base58
- [ ] QR code scans correctly
- [ ] Test transaction (devnet or small mainnet)
- [ ] Transaction appears on explorer
- [ ] Admin can verify in dashboard

### Phantom Test
- [ ] Username claimed on Phantom
- [ ] Resolves to correct public key
- [ ] Test send via Phantom UI
- [ ] Transaction verifiable

### Ko-fi Test
- [ ] Ko-fi Gold approved
- [ ] Page configured correctly
- [ ] Test donation (can refund)
- [ ] Transaction ID obtainable
- [ ] Admin can verify in dashboard

## Security Considerations

### Address Rotation

- **Do not rotate** addresses during campaign
- Supporters may have saved/copied old address
- If compromised: pause campaign, announce new address

### Multi-Sig (Advanced)

For high-value campaigns, consider:
- Multi-signature wallet (Gnosis Safe, etc.)
- Multiple admin approvals for withdrawals
- Time-locked withdrawals

### Monitoring

- Set up **address monitoring** alerts
- Watch for **unusual activity**
- Document **all verified transactions**

## Troubleshooting

### Contribution Not Appearing

1. Check transaction hash on correct explorer
2. Verify correct network (mainnet vs testnet)
3. Check confirmations (BTC: 1+, SOL: instant)
4. Ensure supporter submitted correct hash

### Verification Fails

1. Double-check receiving address
2. Verify amount matches (watch for fees)
3. Check transaction status (success/failed)
4. For BTC: check output index if multiple

### Admin Dashboard Issues

1. Clear browser cache
2. Check Supabase connection
3. Verify service role key configured
4. Check audit logs for errors

## Support Resources

- **Bitcoin**: [Bitcoin.org](https://bitcoin.org), [Blockstream](https://blockstream.info)
- **Solana**: [Solana.com](https://solana.com), [Solscan](https://solscan.io)
- **Phantom**: [Phantom.app](https://phantom.app), [Help Center](https://help.phantom.app)
- **Ko-fi**: [Ko-fi.com](https://ko-fi.com), [Creator Guides](https://ko-fi.com/guides)