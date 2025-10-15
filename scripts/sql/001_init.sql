-- Enums
DO $$ BEGIN
  CREATE TYPE "RoomType" AS ENUM ('BOARDING','ARISAN','COMMUNITY','SPORTS','FAMILY','CUSTOM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "MemberRole" AS ENUM ('ADMIN','MEMBER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE','INACTIVE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "DueFrequency" AS ENUM ('DAILY','WEEKLY','MONTHLY','YEARLY','CUSTOM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT','PENDING','PAID','OVERDUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('CASH','TRANSFER','QRIS','DEBIT','CREDIT','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "DebtStatus" AS ENUM ('PENDING','PAID','OVERDUE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_DUE','PAYMENT_OVERDUE','NEW_MEMBER','INVOICE_SENT','REMINDER_SENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "NotificationPriority" AS ENUM ('LOW','NORMAL','HIGH');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tables
CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Room" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type "RoomType" NOT NULL DEFAULT 'CUSTOM',
  description TEXT,
  "inviteCode" TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "createdById" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS room_createdBy_idx ON "Room"("createdById");

CREATE TABLE IF NOT EXISTS "RoomMember" (
  id SERIAL PRIMARY KEY,
  "roomId" INTEGER NOT NULL REFERENCES "Room"(id) ON DELETE CASCADE,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  role "MemberRole" NOT NULL DEFAULT 'MEMBER',
  status "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
  "joinedAt" TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE("roomId","userId")
);

CREATE INDEX IF NOT EXISTS roommember_user_idx ON "RoomMember"("userId");

CREATE TABLE IF NOT EXISTS "Due" (
  id SERIAL PRIMARY KEY,
  "roomId" INTEGER NOT NULL REFERENCES "Room"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL,
  "isRecurring" BOOLEAN NOT NULL DEFAULT false,
  frequency "DueFrequency",
  interval INTEGER,
  "startDate" TIMESTAMP,
  "nextDueDate" TIMESTAMP,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS due_room_idx ON "Due"("roomId");
CREATE INDEX IF NOT EXISTS due_active_idx ON "Due"("isActive");

CREATE TABLE IF NOT EXISTS "Invoice" (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  "roomId" INTEGER NOT NULL REFERENCES "Room"(id) ON DELETE CASCADE,
  "memberId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "dueId" INTEGER REFERENCES "Due"(id),
  description TEXT,
  amount INTEGER NOT NULL,
  status "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  "dueDate" TIMESTAMP NOT NULL,
  "sentAt" TIMESTAMP,
  "paidDate" TIMESTAMP,
  "paymentMethod" "PaymentMethod",
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoice_room_status_idx ON "Invoice"("roomId", "status");
CREATE INDEX IF NOT EXISTS invoice_member_idx ON "Invoice"("memberId");
CREATE INDEX IF NOT EXISTS invoice_duedate_idx ON "Invoice"("dueDate");

CREATE TABLE IF NOT EXISTS "Payment" (
  id SERIAL PRIMARY KEY,
  "invoiceId" TEXT NOT NULL REFERENCES "Invoice"(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  method "PaymentMethod" NOT NULL,
  "paidAt" TIMESTAMP NOT NULL DEFAULT now(),
  note TEXT,
  "createdById" INTEGER NOT NULL REFERENCES "User"(id)
);

CREATE INDEX IF NOT EXISTS payment_invoice_idx ON "Payment"("invoiceId");
CREATE INDEX IF NOT EXISTS payment_createdby_idx ON "Payment"("createdById");

CREATE TABLE IF NOT EXISTS "Debt" (
  id SERIAL PRIMARY KEY,
  "roomId" INTEGER NOT NULL REFERENCES "Room"(id) ON DELETE CASCADE,
  "creditorId" INTEGER NOT NULL REFERENCES "User"(id),
  "debtorId" INTEGER NOT NULL REFERENCES "User"(id),
  amount INTEGER NOT NULL,
  description TEXT,
  "dueDate" TIMESTAMP,
  status "DebtStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS debt_room_idx ON "Debt"("roomId");
CREATE INDEX IF NOT EXISTS debt_creditor_idx ON "Debt"("creditorId");
CREATE INDEX IF NOT EXISTS debt_debtor_idx ON "Debt"("debtorId");
CREATE INDEX IF NOT EXISTS debt_status_idx ON "Debt"(status);

CREATE TABLE IF NOT EXISTS "Notification" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "roomId" INTEGER REFERENCES "Room"(id) ON DELETE SET NULL,
  type "NotificationType" NOT NULL,
  priority "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  amount INTEGER,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notif_user_read_idx ON "Notification"("userId", "isRead");
CREATE INDEX IF NOT EXISTS notif_room_idx ON "Notification"("roomId");
CREATE INDEX IF NOT EXISTS notif_type_idx ON "Notification"(type);

CREATE TABLE IF NOT EXISTS "ReminderSetting" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "roomId" INTEGER REFERENCES "Room"(id) ON DELETE SET NULL,
  "paymentReminders" BOOLEAN NOT NULL DEFAULT true,
  "overdueAlerts" BOOLEAN NOT NULL DEFAULT true,
  "memberActivity" BOOLEAN NOT NULL DEFAULT true,
  "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
  "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE("userId","roomId")
);

CREATE INDEX IF NOT EXISTS reminder_room_idx ON "ReminderSetting"("roomId");

CREATE TABLE IF NOT EXISTS "Invite" (
  id SERIAL PRIMARY KEY,
  "roomId" INTEGER NOT NULL REFERENCES "Room"(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  "expiresAt" TIMESTAMP,
  "createdById" INTEGER NOT NULL REFERENCES "User"(id),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invite_room_idx ON "Invite"("roomId");
CREATE INDEX IF NOT EXISTS invite_createdby_idx ON "Invite"("createdById");
