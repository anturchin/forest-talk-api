import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1728223359145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE Users (
      user_id BIGINT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      public_key TEXT NOT NULL,
      private_key TEXT NOT NULL,
      is_online BOOLEAN NOT NULL DEFAULT FALSE,
      last_login TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE Users`);
  }
}
