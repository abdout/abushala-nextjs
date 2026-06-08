import { randomUUID } from "crypto";
import { db } from "@/lib/db";

const ONE_HOUR_MS = 60 * 60 * 1000;

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.verificationToken.findUnique({ where: { token } });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.verificationToken.findFirst({ where: { email } });
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    return await db.passwordResetToken.findUnique({ where: { token } });
  } catch {
    return null;
  }
};

/**
 * Issue a fresh email-verification token, replacing any existing one for the
 * same email so a user can only have one pending link at a time.
 */
export const generateVerificationToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + ONE_HOUR_MS);

  const existing = await getVerificationTokenByEmail(email);
  if (existing) {
    await db.verificationToken.delete({ where: { id: existing.id } });
  }

  return db.verificationToken.create({ data: { email, token, expires } });
};

/**
 * Issue a fresh password-reset token, replacing any existing one for the email.
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = randomUUID();
  const expires = new Date(Date.now() + ONE_HOUR_MS);

  const existing = await db.passwordResetToken.findFirst({ where: { email } });
  if (existing) {
    await db.passwordResetToken.delete({ where: { id: existing.id } });
  }

  return db.passwordResetToken.create({ data: { email, token, expires } });
};
