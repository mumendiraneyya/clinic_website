import { UI } from 'astrowind:config';

/**
 * Booking / WhatsApp maintenance flags.
 *
 * Both default to "everything on". Each is overridable via a PUBLIC_ env var so the
 * state can be flipped at deploy time (e.g. Cloudflare Pages) without editing config.
 */

/**
 * The whole booking flow (phone verification + Cal.com) is offline.
 * Flip on when the n8n backend is down — gates the hero booking pill and the
 * /book, /popup/book, /bookings, /video pages.
 */
export const bookingDisabled =
  UI.bookingDisabled === true || import.meta.env.PUBLIC_BOOKING_DISABLED === 'true';

/**
 * The automated WhatsApp bot number is in service.
 * Flip off (false) when the n8n AI assistant is down — routes the general
 * "contact us" inquiry CTAs to the doctor's human number instead of the bot.
 */
export const automatedWhatsapp =
  UI.automatedWhatsapp !== false && import.meta.env.PUBLIC_AUTOMATED_WHATSAPP !== 'false';

/** Automated WhatsApp bot number (handled by the n8n AI assistant). */
export const AUTOMATED_WHATSAPP_NUMBER = '962782760965';

/** Doctor's verified WhatsApp Business number (answered by a human). */
export const HUMAN_WHATSAPP_NUMBER = '962799133299';

/** Number to use for general "contact us" inquiry CTAs. */
export const contactWhatsappNumber = automatedWhatsapp ? AUTOMATED_WHATSAPP_NUMBER : HUMAN_WHATSAPP_NUMBER;
