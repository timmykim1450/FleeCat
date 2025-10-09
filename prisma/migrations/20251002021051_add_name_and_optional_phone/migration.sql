-- AlterTable
ALTER TABLE "member" ALTER COLUMN "member_phone" DROP NOT NULL,
ALTER COLUMN "member_account_type" SET DEFAULT 'email';
