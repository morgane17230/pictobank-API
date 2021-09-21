BEGIN;

DROP TABLE IF EXISTS
"user",
"folder",
"picto",
"folder_has_picto";

CREATE TABLE "user" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "lastname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "folder" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "foldername" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL REFERENCES "user"("id") ON
DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "picto" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "originalname" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "folder_has_picto" (
    "folder_id" INTEGER NOT NULL REFERENCES "folder"("id") ON
DELETE CASCADE,
    "picto_id" INTEGER NOT NULL REFERENCES "picto"("id") ON
DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;