export const QR_CHANNELS = ["table", "poster", "flyer", "direct"] as const;

export type QrChannel = (typeof QR_CHANNELS)[number];

export interface QrScanInput {
  readonly slug: string;
  readonly channel?: string;
}
