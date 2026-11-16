/**
 * QR Code utility functions
 * Generates QR code data URLs for Bitcoin and Solana addresses
 */

// Bitcoin URI scheme: bitcoin:<address>?amount=<amount>&label=<label>&message=<message>
// Solana URI scheme: solana:<address>?amount=<amount>&label=<label>&message=<message>

export interface QRCodeOptions {
  address: string;
  amount?: number; // Amount in base unit (BTC, SOL)
  label?: string;
  message?: string;
  network: 'bitcoin' | 'solana';
}

export interface QRCodeResult {
  dataUrl: string;
  uri: string;
}

/**
 * Generate Bitcoin URI
 */
export function generateBitcoinURI(address: string, options?: { amount?: number; label?: string; message?: string }): string {
  const params = new URLSearchParams();

  if (options?.amount) {
    // Convert to BTC with 8 decimal places
    params.set('amount', (options.amount / 100_000_000).toFixed(8).replace(/\.?0+$/, ''));
  }
  if (options?.label) {
    params.set('label', options.label);
  }
  if (options?.message) {
    params.set('message', options.message);
  }

  const queryString = params.toString();
  return `bitcoin:${address}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Generate Solana URI
 */
export function generateSolanaURI(address: string, options?: { amount?: number; label?: string; message?: string }): string {
  const params = new URLSearchParams();

  if (options?.amount) {
    // Convert to SOL with 9 decimal places
    params.set('amount', (options.amount / 1_000_000_000).toFixed(9).replace(/\.?0+$/, ''));
  }
  if (options?.label) {
    params.set('label', options.label);
  }
  if (options?.message) {
    params.set('message', options.message);
  }

  const queryString = params.toString();
  return `solana:${address}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Generate QR code data URI
 */
export async function generateQRCodeDataURL(uri: string, _size: number = 256): Promise<string> {
  // This is a placeholder - in a real implementation, you'd use a QR code library
  // For now, we'll use a simple canvas-based approach or return a placeholder
  // The actual QRCode component will handle rendering

  // We return the URI itself; the QRCode component will render it
  return uri;
}

/**
 * Generate QR code for contribution address
 */
export function generateContributionQRCode(options: QRCodeOptions): QRCodeResult {
  let uri: string;

  if (options.network === 'bitcoin') {
    uri = generateBitcoinURI(options.address, {
      amount: options.amount,
      label: options.label || 'One Human Initiative',
      message: options.message,
    });
  } else {
    uri = generateSolanaURI(options.address, {
      amount: options.amount,
      label: options.label || 'One Human Initiative',
      message: options.message,
    });
  }

  return {
    uri,
    dataUrl: uri, // The QRCode component will generate the actual image
  };
}

/**
 * Validate Bitcoin address format
 */
export function validateBitcoinAddress(address: string): boolean {
  // Legacy (P2PKH): starts with 1, 25-34 chars
  // Legacy (P2SH): starts with 3, 25-34 chars
  // Native SegWit (Bech32): starts with bc1, 39-59 chars
  // Taproot (Bech32m): starts with bc1p, 59-62 chars
  const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
  const bech32mRegex = /^bc1p[a-z0-9]{58,61}$/;

  return legacyRegex.test(address) || bech32Regex.test(address) || bech32mRegex.test(address);
}

/**
 * Validate Solana address format
 */
export function validateSolanaAddress(address: string): boolean {
  // Base58 encoded, 32-44 characters
  const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return regex.test(address);
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddressForDisplay(address: string, chars: number = 8): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}