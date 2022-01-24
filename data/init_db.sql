BEGIN;

SELECT
    gen_random_uuid();

DROP TABLE IF EXISTS 
"organization",
"user",
"folder",
"picto",
"category",
"folder_has_picto";

CREATE TABLE "organization" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "org_id" UUID NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "folder" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "foldername" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "org_id" UUID NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "category" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "picto" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "originalname" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "category_id" UUID NOT NULL REFERENCES "category"("id"),
    "org_id" UUID NOT NULL REFERENCES "organization"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "folder_has_picto" (
    "folder_id" UUID NOT NULL REFERENCES "folder"("id") ON
DELETE CASCADE,
    "picto_id" UUID NOT NULL REFERENCES "picto"("id") ON
DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;