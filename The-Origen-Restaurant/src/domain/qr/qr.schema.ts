import { z } from "zod";
import { QR_CHANNELS } from "./qr.types";

export const qrScanSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,39}$/),
    channel: z.enum(QR_CHANNELS).optional(),
  })
  .strict();
