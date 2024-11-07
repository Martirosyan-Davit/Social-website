import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1731007537080 implements MigrationInterface {
  name = 'CreateTables1731007537080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "firstName" character varying NOT NULL,
      "lastName" character varying NOT NULL,
      "age" character varying,
      "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER',
      "email" character varying NOT NULL,
      "password" character varying NOT NULL,
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
      CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."communications_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "communications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "followerId" uuid NOT NULL,
      "followingId" uuid NOT NULL,
      "status" "public"."communications_status_enum" NOT NULL DEFAULT 'PENDING',
      CONSTRAINT "PK_29ec793018d5d5ca19d40149e87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_4f16f5cac852829c363c654b67e"
       FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" ADD CONSTRAINT "FK_5f11a1ec32809cec890ab48b87e"
       FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_5f11a1ec32809cec890ab48b87e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "communications" DROP CONSTRAINT "FK_4f16f5cac852829c363c654b67e"`,
    );
    await queryRunner.query(`DROP TABLE "communications"`);
    await queryRunner.query(`DROP TYPE "public"."communications_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
