/*
  Warnings:

  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."coupon" DROP CONSTRAINT "coupon_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."member_address" DROP CONSTRAINT "member_address_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."member_permissions" DROP CONSTRAINT "member_permissions_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."member_transactions" DROP CONSTRAINT "member_transactions_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."members" DROP CONSTRAINT "members_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."shopping_cart" DROP CONSTRAINT "shopping_cart_member_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tenant_member" DROP CONSTRAINT "tenant_member_member_id_fkey";

-- DropTable
DROP TABLE "public"."members";

-- CreateTable
CREATE TABLE "member" (
    "member_id" BIGSERIAL NOT NULL,
    "company_id" BIGINT,
    "member_email" VARCHAR(100) NOT NULL,
    "member_password" VARCHAR(255),
    "member_name" VARCHAR(30) NOT NULL,
    "member_nickname" VARCHAR(30) NOT NULL,
    "member_phone" VARCHAR(15) NOT NULL,
    "member_account_type" VARCHAR(20) NOT NULL,
    "member_account_role" VARCHAR(20) NOT NULL DEFAULT 'buyer',
    "member_status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "member_marketing_email" BOOLEAN NOT NULL DEFAULT false,
    "member_marketing_sms" BOOLEAN NOT NULL DEFAULT false,
    "member_last_login_at" TIMESTAMP(3),
    "member_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("member_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_member_email_key" ON "member"("member_email");

-- CreateIndex
CREATE UNIQUE INDEX "member_member_nickname_key" ON "member"("member_nickname");

-- CreateIndex
CREATE INDEX "member_company_id_idx" ON "member"("company_id");

-- CreateIndex
CREATE INDEX "member_member_email_idx" ON "member"("member_email");

-- CreateIndex
CREATE INDEX "member_member_account_role_idx" ON "member"("member_account_role");

-- CreateIndex
CREATE INDEX "member_member_status_idx" ON "member"("member_status");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_address" ADD CONSTRAINT "member_address_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_permissions" ADD CONSTRAINT "member_permissions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_transactions" ADD CONSTRAINT "member_transactions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;
