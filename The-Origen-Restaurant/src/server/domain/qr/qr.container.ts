import { Environment } from "@/server/config/environment";
import { logger } from "@/server/core/logger";
import { HmacHasher } from "@/server/infrastructure/hashing/hmac-hasher";
import { rateLimiter } from "@/server/infrastructure/rate-limit/rate-limit.registry";
import { QrScanService } from "./qr-scan.service";

export const qrScanService = new QrScanService(
  rateLimiter,
  new HmacHasher(Environment.ipSalt),
  logger,
);
