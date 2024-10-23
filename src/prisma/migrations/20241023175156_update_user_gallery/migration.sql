-- DropIndex
DROP INDEX "UserGallery_img_id_key";

-- AlterTable
CREATE SEQUENCE usergallery_img_id_seq;
ALTER TABLE "UserGallery" ALTER COLUMN "img_id" SET DEFAULT nextval('usergallery_img_id_seq'),
ADD CONSTRAINT "UserGallery_pkey" PRIMARY KEY ("img_id");
ALTER SEQUENCE usergallery_img_id_seq OWNED BY "UserGallery"."img_id";
