import { RESTAURANT } from "@/content/restaurant";
import { ServiceSchedule } from "@/domain/reservations/service-schedule";
import { Environment } from "@/server/config/environment";
import { logger } from "@/server/core/logger";
import { HmacHasher } from "@/server/infrastructure/hashing/hmac-hasher";
import { rateLimiter } from "@/server/infrastructure/rate-limit/rate-limit.registry";
import { HavanaClock } from "./havana-clock";
import { ReferenceFactory } from "./reference.factory";
import { ReservationService } from "./reservation.service";
import { WhatsAppLinkFactory } from "./whatsapp-link.factory";
import { WhatsAppMessageBuilder } from "./whatsapp-message.builder";

const hasher = new HmacHasher(Environment.ipSalt);

export const reservationService = new ReservationService({
  clock: new HavanaClock(),
  schedule: new ServiceSchedule(
    RESTAURANT.serviceDays,
    RESTAURANT.reservation.slotStepMinutes,
  ),
  rateLimiter,
  hasher,
  references: new ReferenceFactory(),
  messages: new WhatsAppMessageBuilder(),
  whatsapp: new WhatsAppLinkFactory(Environment.whatsappNumber),
  logger,
});

export const reservationHasher = hasher;
