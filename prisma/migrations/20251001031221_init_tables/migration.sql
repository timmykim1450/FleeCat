-- CreateTable
CREATE TABLE "company" (
    "company_id" BIGSERIAL NOT NULL,
    "company_name" VARCHAR(100) NOT NULL,
    "company_business_number" VARCHAR(10) NOT NULL,
    "company_business_type" VARCHAR(50),
    "company_business_item" VARCHAR(50),
    "company_ceo_name" VARCHAR(30) NOT NULL,
    "company_ceo_phone" VARCHAR(15),
    "company_ceo_email" VARCHAR(100),
    "company_phone" VARCHAR(15) NOT NULL,
    "company_email" VARCHAR(100),
    "company_zipcode" VARCHAR(10) NOT NULL,
    "company_address" VARCHAR(200) NOT NULL,
    "company_address_detail" VARCHAR(100),
    "company_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "company_approval_memo" TEXT,
    "company_applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_approved_at" TIMESTAMP(3),
    "company_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "members" (
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

    CONSTRAINT "members_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "member_address" (
    "member_address_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "member_address_alias" VARCHAR(30) NOT NULL,
    "member_address_is_default" BOOLEAN NOT NULL DEFAULT false,
    "member_address_recipient" VARCHAR(30) NOT NULL,
    "member_address_phone" VARCHAR(15) NOT NULL,
    "member_address_zipcode" VARCHAR(10) NOT NULL,
    "member_address_address1" VARCHAR(100) NOT NULL,
    "member_address_address2" VARCHAR(100),
    "member_address_last_used_at" TIMESTAMP(3),
    "member_address_status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "member_address_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_address_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_address_pkey" PRIMARY KEY ("member_address_id")
);

-- CreateTable
CREATE TABLE "member_permissions" (
    "member_permission_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "member_permission_role" INTEGER NOT NULL DEFAULT 1,
    "can_purchase" BOOLEAN NOT NULL DEFAULT true,
    "can_board_write" BOOLEAN NOT NULL DEFAULT true,
    "is_account_active" BOOLEAN NOT NULL DEFAULT true,
    "can_sell" BOOLEAN NOT NULL DEFAULT false,
    "can_product_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_order_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_payment_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_member_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_board_moderate" BOOLEAN NOT NULL DEFAULT false,
    "can_review_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_promotion_manage" BOOLEAN NOT NULL DEFAULT false,
    "can_statistics_view" BOOLEAN NOT NULL DEFAULT false,
    "can_system_config" BOOLEAN NOT NULL DEFAULT false,
    "can_inquiry_view" BOOLEAN NOT NULL DEFAULT false,
    "can_inquiry_reply" BOOLEAN NOT NULL DEFAULT false,
    "is_restricted" BOOLEAN NOT NULL DEFAULT false,
    "is_seller_approved" BOOLEAN NOT NULL DEFAULT false,
    "member_permission_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_permission_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_permissions_pkey" PRIMARY KEY ("member_permission_id")
);

-- CreateTable
CREATE TABLE "member_transactions" (
    "member_transaction_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "transaction_type" VARCHAR(20) NOT NULL,
    "transaction_amount" DECIMAL(15,2) NOT NULL,
    "transaction_title" VARCHAR(100) NOT NULL,
    "payment_method" VARCHAR(30),
    "related_order_id" BIGINT,
    "transaction_date" DATE NOT NULL,
    "transaction_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_transactions_pkey" PRIMARY KEY ("member_transaction_id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "tenant_id" BIGSERIAL NOT NULL,
    "tenant_name" VARCHAR(50) NOT NULL,
    "tenant_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "tenant_approval_member" TEXT,
    "tenant_applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_approved_at" TIMESTAMP(3),
    "tenant_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "tenant_detail" (
    "tenant_detail_id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "tenant_detail_description" TEXT,
    "tenant_detail_phone" VARCHAR(15),
    "tenant_detail_email" VARCHAR(100),
    "tenant_detail_zipcode" VARCHAR(10),
    "tenant_detail_address" VARCHAR(200),
    "tenant_detail_address_detail" VARCHAR(100),
    "tenant_detail_business_hours" VARCHAR(100),
    "tenant_detail_commission_rate" DECIMAL(5,2),
    "tenant_detail_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_detail_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_detail_pkey" PRIMARY KEY ("tenant_detail_id")
);

-- CreateTable
CREATE TABLE "tenant_member" (
    "tenant_member_id" BIGSERIAL NOT NULL,
    "tenant_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,
    "tenant_member_role" VARCHAR(20) NOT NULL,
    "tenant_member_approval_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "tenant_member_approved_at" TIMESTAMP(3),
    "tenant_member_bank_name" VARCHAR(30),
    "tenant_member_bank_account" VARCHAR(50),
    "tenant_member_account_holder" VARCHAR(30),
    "tenant_member_commission_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.0500,
    "tenant_member_total_sales_amount" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "tenant_member_total_sales_count" INTEGER NOT NULL DEFAULT 0,
    "tenant_member_suspended_by" VARCHAR(20),
    "tenant_member_suspended_reason" TEXT,
    "tenant_member_applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenant_member_activated_at" TIMESTAMP(3),
    "tenant_member_last_sale_at" TIMESTAMP(3),
    "tenant_member_suspended_at" TIMESTAMP(3),

    CONSTRAINT "tenant_member_pkey" PRIMARY KEY ("tenant_member_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" BIGSERIAL NOT NULL,
    "parent_category_id" BIGINT,
    "category_name" VARCHAR(50) NOT NULL,
    "category_description" TEXT,
    "category_depth" INTEGER NOT NULL DEFAULT 1,
    "category_order" INTEGER NOT NULL DEFAULT 0,
    "category_path" VARCHAR(255),
    "category_is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" BIGSERIAL NOT NULL,
    "tenant_member_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL DEFAULT 0,
    "product_name" VARCHAR(100) NOT NULL,
    "product_description" TEXT,
    "product_price" DECIMAL(10,2) NOT NULL,
    "product_quantity" INTEGER NOT NULL DEFAULT 0,
    "product_status" VARCHAR(20) NOT NULL DEFAULT 'inactive',
    "product_view_count" INTEGER NOT NULL DEFAULT 0,
    "product_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "product_img" (
    "product_img_id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_img_url" VARCHAR(500) NOT NULL,
    "product_image_sequence" INTEGER NOT NULL DEFAULT 0,
    "product_img_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_img_pkey" PRIMARY KEY ("product_img_id")
);

-- CreateTable
CREATE TABLE "coupon" (
    "coupon_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "coupon_name" VARCHAR(50) NOT NULL,
    "coupon_code" VARCHAR(20) NOT NULL,
    "coupon_discount_type" VARCHAR(10) NOT NULL,
    "coupon_discount_value" DECIMAL(10,2) NOT NULL,
    "coupon_min_order_amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "coupon_is_used" BOOLEAN NOT NULL DEFAULT false,
    "coupon_used_at" TIMESTAMP(3),
    "coupon_expired_at" TIMESTAMP(3) NOT NULL,
    "coupon_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coupon_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_pkey" PRIMARY KEY ("coupon_id")
);

-- CreateTable
CREATE TABLE "shopping_cart" (
    "shopping_cart_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "shopping_cart_quantity" INTEGER NOT NULL DEFAULT 1,
    "shopping_cart_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopping_cart_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shopping_cart_pkey" PRIMARY KEY ("shopping_cart_id")
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "shopping_cart_id" BIGINT,
    "coupon_id" BIGINT,
    "order_number" VARCHAR(50) NOT NULL,
    "order_total_amount" DECIMAL(15,2) NOT NULL,
    "order_discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "order_subtotal_amount" DECIMAL(15,2) NOT NULL,
    "order_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "order_recipient_name" VARCHAR(30) NOT NULL,
    "order_recipient_phone" VARCHAR(15) NOT NULL,
    "order_recipient_address" VARCHAR(200) NOT NULL,
    "order_message" TEXT,
    "order_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "payment_method" VARCHAR(20) NOT NULL,
    "payment_amount" DECIMAL(15,2) NOT NULL,
    "payment_discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "payment_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "payment_transaction_id" VARCHAR(100),
    "payment_pg_name" VARCHAR(30),
    "payment_approved_at" TIMESTAMP(3),
    "payment_cancelled_at" TIMESTAMP(3),
    "payment_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_company_name_key" ON "company"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "company_company_business_number_key" ON "company"("company_business_number");

-- CreateIndex
CREATE INDEX "company_company_status_idx" ON "company"("company_status");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_email_key" ON "members"("member_email");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_nickname_key" ON "members"("member_nickname");

-- CreateIndex
CREATE INDEX "members_company_id_idx" ON "members"("company_id");

-- CreateIndex
CREATE INDEX "members_member_email_idx" ON "members"("member_email");

-- CreateIndex
CREATE INDEX "members_member_account_role_idx" ON "members"("member_account_role");

-- CreateIndex
CREATE INDEX "members_member_status_idx" ON "members"("member_status");

-- CreateIndex
CREATE INDEX "member_address_member_id_idx" ON "member_address"("member_id");

-- CreateIndex
CREATE INDEX "member_address_member_id_member_address_status_idx" ON "member_address"("member_id", "member_address_status");

-- CreateIndex
CREATE INDEX "member_address_member_id_member_address_is_default_idx" ON "member_address"("member_id", "member_address_is_default");

-- CreateIndex
CREATE INDEX "member_address_member_id_member_address_last_used_at_idx" ON "member_address"("member_id", "member_address_last_used_at");

-- CreateIndex
CREATE UNIQUE INDEX "member_permissions_member_id_key" ON "member_permissions"("member_id");

-- CreateIndex
CREATE INDEX "member_permissions_member_id_idx" ON "member_permissions"("member_id");

-- CreateIndex
CREATE INDEX "member_permissions_member_permission_role_idx" ON "member_permissions"("member_permission_role");

-- CreateIndex
CREATE INDEX "member_permissions_is_account_active_idx" ON "member_permissions"("is_account_active");

-- CreateIndex
CREATE INDEX "member_permissions_member_id_can_purchase_is_account_active_idx" ON "member_permissions"("member_id", "can_purchase", "is_account_active");

-- CreateIndex
CREATE INDEX "member_permissions_member_id_can_sell_is_seller_approved_idx" ON "member_permissions"("member_id", "can_sell", "is_seller_approved");

-- CreateIndex
CREATE INDEX "member_permissions_member_id_can_member_manage_can_system_c_idx" ON "member_permissions"("member_id", "can_member_manage", "can_system_config");

-- CreateIndex
CREATE INDEX "member_transactions_member_id_idx" ON "member_transactions"("member_id");

-- CreateIndex
CREATE INDEX "member_transactions_transaction_date_idx" ON "member_transactions"("transaction_date" DESC);

-- CreateIndex
CREATE INDEX "member_transactions_member_id_transaction_type_idx" ON "member_transactions"("member_id", "transaction_type");

-- CreateIndex
CREATE INDEX "member_transactions_related_order_id_idx" ON "member_transactions"("related_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_tenant_name_key" ON "tenant"("tenant_name");

-- CreateIndex
CREATE INDEX "tenant_tenant_name_idx" ON "tenant"("tenant_name");

-- CreateIndex
CREATE INDEX "tenant_tenant_status_idx" ON "tenant"("tenant_status");

-- CreateIndex
CREATE INDEX "tenant_tenant_status_tenant_applied_at_idx" ON "tenant"("tenant_status", "tenant_applied_at");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_detail_tenant_id_key" ON "tenant_detail"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_member_tenant_id_idx" ON "tenant_member"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_member_member_id_idx" ON "tenant_member"("member_id");

-- CreateIndex
CREATE INDEX "tenant_member_tenant_id_tenant_member_role_idx" ON "tenant_member"("tenant_id", "tenant_member_role");

-- CreateIndex
CREATE INDEX "tenant_member_tenant_id_tenant_member_approval_status_idx" ON "tenant_member"("tenant_id", "tenant_member_approval_status");

-- CreateIndex
CREATE INDEX "tenant_member_tenant_id_tenant_member_approval_status_tenan_idx" ON "tenant_member"("tenant_id", "tenant_member_approval_status", "tenant_member_applied_at");

-- CreateIndex
CREATE INDEX "category_parent_category_id_idx" ON "category"("parent_category_id");

-- CreateIndex
CREATE INDEX "category_category_depth_idx" ON "category"("category_depth");

-- CreateIndex
CREATE INDEX "category_category_path_idx" ON "category"("category_path");

-- CreateIndex
CREATE INDEX "category_parent_category_id_category_order_idx" ON "category"("parent_category_id", "category_order");

-- CreateIndex
CREATE INDEX "category_category_is_active_idx" ON "category"("category_is_active");

-- CreateIndex
CREATE INDEX "product_tenant_member_id_idx" ON "product"("tenant_member_id");

-- CreateIndex
CREATE INDEX "product_category_id_idx" ON "product"("category_id");

-- CreateIndex
CREATE INDEX "product_product_status_idx" ON "product"("product_status");

-- CreateIndex
CREATE INDEX "product_product_status_product_created_at_idx" ON "product"("product_status", "product_created_at");

-- CreateIndex
CREATE INDEX "product_product_name_idx" ON "product"("product_name");

-- CreateIndex
CREATE INDEX "product_product_price_idx" ON "product"("product_price");

-- CreateIndex
CREATE INDEX "product_product_view_count_idx" ON "product"("product_view_count");

-- CreateIndex
CREATE INDEX "product_img_product_id_idx" ON "product_img"("product_id");

-- CreateIndex
CREATE INDEX "product_img_product_id_product_image_sequence_idx" ON "product_img"("product_id", "product_image_sequence");

-- CreateIndex
CREATE UNIQUE INDEX "product_img_product_id_product_image_sequence_key" ON "product_img"("product_id", "product_image_sequence");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_coupon_code_key" ON "coupon"("coupon_code");

-- CreateIndex
CREATE INDEX "coupon_member_id_idx" ON "coupon"("member_id");

-- CreateIndex
CREATE INDEX "coupon_coupon_code_idx" ON "coupon"("coupon_code");

-- CreateIndex
CREATE INDEX "coupon_member_id_coupon_is_used_coupon_expired_at_idx" ON "coupon"("member_id", "coupon_is_used", "coupon_expired_at");

-- CreateIndex
CREATE INDEX "shopping_cart_member_id_idx" ON "shopping_cart"("member_id");

-- CreateIndex
CREATE INDEX "shopping_cart_product_id_idx" ON "shopping_cart"("product_id");

-- CreateIndex
CREATE INDEX "shopping_cart_shopping_cart_created_at_idx" ON "shopping_cart"("shopping_cart_created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_cart_member_id_product_id_key" ON "shopping_cart"("member_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_order_number_key" ON "order"("order_number");

-- CreateIndex
CREATE INDEX "order_member_id_idx" ON "order"("member_id");

-- CreateIndex
CREATE INDEX "order_order_number_idx" ON "order"("order_number");

-- CreateIndex
CREATE INDEX "order_order_status_idx" ON "order"("order_status");

-- CreateIndex
CREATE INDEX "order_order_status_order_created_at_idx" ON "order"("order_status", "order_created_at");

-- CreateIndex
CREATE INDEX "order_order_created_at_idx" ON "order"("order_created_at");

-- CreateIndex
CREATE INDEX "order_shopping_cart_id_idx" ON "order"("shopping_cart_id");

-- CreateIndex
CREATE INDEX "order_coupon_id_idx" ON "order"("coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_id_key" ON "payment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_payment_transaction_id_key" ON "payment"("payment_transaction_id");

-- CreateIndex
CREATE INDEX "payment_payment_status_idx" ON "payment"("payment_status");

-- CreateIndex
CREATE INDEX "payment_payment_transaction_id_idx" ON "payment"("payment_transaction_id");

-- CreateIndex
CREATE INDEX "payment_payment_approved_at_idx" ON "payment"("payment_approved_at");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_address" ADD CONSTRAINT "member_address_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_permissions" ADD CONSTRAINT "member_permissions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_transactions" ADD CONSTRAINT "member_transactions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_transactions" ADD CONSTRAINT "member_transactions_related_order_id_fkey" FOREIGN KEY ("related_order_id") REFERENCES "order"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_detail" ADD CONSTRAINT "tenant_detail_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("tenant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_tenant_member_id_fkey" FOREIGN KEY ("tenant_member_id") REFERENCES "tenant_member"("tenant_member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_img" ADD CONSTRAINT "product_img_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupon"("coupon_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
