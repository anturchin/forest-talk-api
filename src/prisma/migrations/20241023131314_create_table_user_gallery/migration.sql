-- CreateTable
CREATE TABLE "UserGallery" (
    "img_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGallery_img_id_key" ON "UserGallery"("img_id");

-- AddForeignKey
ALTER TABLE "UserGallery" ADD CONSTRAINT "UserGallery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
