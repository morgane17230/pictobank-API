BEGIN;

SELECT gen_random_uuid();

DROP TABLE IF EXISTS
"user",
"folder",
"picto",
"folder_has_picto";



CREATE TABLE "user" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
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
    "user_id" UUID NOT NULL REFERENCES "user"("id") ON
DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "picto" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "originalname" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "user_id" UUID NOT NULL REFERENCES "user"("id"), 
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