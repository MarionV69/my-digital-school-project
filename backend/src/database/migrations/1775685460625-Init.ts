import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1775685460625 implements MigrationInterface {
  name = 'Init1775685460625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`label\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_972f95f212512a35e838562ea3\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_96152d453aaea425b5afde3ae9\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier_attributes\` (\`supplier_id\` int NOT NULL, \`supplier_type\` enum ('WHOLESALER', 'RESELLER', 'PRODUCER') NOT NULL DEFAULT 'PRODUCER', \`price_range\` enum ('ECONOMIC', 'MID_RANGE', 'PREMIUM') NOT NULL DEFAULT 'ECONOMIC', \`delivery_radius_km\` int NULL, \`delivery_information\` text NULL, \`minimum_order_amount\` decimal(10,2) NULL, \`is_premium\` tinyint NOT NULL DEFAULT 0, \`is_visible\` tinyint NOT NULL DEFAULT 1, INDEX \`idx_supplier_is_visible\` (\`is_visible\`), INDEX \`idx_supplier_is_premium\` (\`is_premium\`), INDEX \`idx_supplier_type\` (\`supplier_type\`), PRIMARY KEY (\`supplier_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`favorite\` (\`id\` int NOT NULL AUTO_INCREMENT, \`owner_id\` int NOT NULL, \`target_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`uq_favorite_owner_target\` (\`owner_id\`, \`target_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`reviewer_restaurant_id\` int NOT NULL, \`reviewed_supplier_id\` int NOT NULL, \`rating\` tinyint NOT NULL, \`comment\` text NOT NULL, \`reply\` text NULL, \`replied_at\` datetime NULL, \`status\` enum ('PUBLISHED', 'MASKED') NOT NULL DEFAULT 'PUBLISHED', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_00657e860d145b0e221fd34be3\` (\`reviewed_supplier_id\`), INDEX \`IDX_617f9f78f80e82a1cead4523e5\` (\`reviewer_restaurant_id\`), UNIQUE INDEX \`uq_review_restaurant_supplier\` (\`reviewer_restaurant_id\`, \`reviewed_supplier_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`restaurant_id\` int NOT NULL, \`supplier_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`last_message_at\` datetime NULL, INDEX \`IDX_bf7dbefd6bc24cbbe5a3b950bf\` (\`supplier_id\`), INDEX \`IDX_c7f84628e427179eed45d8ec84\` (\`restaurant_id\`), INDEX \`idx_conversation_last_message\` (\`last_message_at\`), UNIQUE INDEX \`uq_conversation_restaurant_supplier\` (\`restaurant_id\`, \`supplier_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`conversation_id\` int NOT NULL, \`sender_type\` enum ('RESTAURANT', 'SUPPLIER') NOT NULL, \`content\` text NOT NULL, \`sent_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`is_read_by_recipient\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_7fe3e887d78498d9c9813375ce\` (\`conversation_id\`), INDEX \`idx_message_sent_at\` (\`sent_at\`), INDEX \`idx_message_is_read_by_recipient\` (\`is_read_by_recipient\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`stored_file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`original_filename\` varchar(255) NOT NULL, \`mime_type\` varchar(50) NOT NULL, \`size\` int NOT NULL, \`path\` varchar(512) NOT NULL, \`uploaded_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`establishment_id\` int NOT NULL, \`file_id\` int NOT NULL, \`category\` enum ('CATALOG', 'LOGO', 'COVER_PHOTO', 'GALLERY_PHOTO') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`idx_document_category\` (\`category\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`establishment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('RESTAURANT', 'SUPPLIER') NOT NULL, \`siret\` varchar(14) NOT NULL, \`legal_name\` varchar(255) NOT NULL, \`trade_name\` varchar(255) NULL, \`vat_number\` varchar(50) NULL, \`email\` varchar(150) NULL, \`phone\` varchar(20) NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(100) NOT NULL, \`postal_code\` varchar(10) NOT NULL, \`country\` varchar(100) NOT NULL DEFAULT 'FRANCE', \`latitude\` decimal(9,6) NULL, \`longitude\` decimal(9,6) NULL, \`description\` text NULL, \`website\` varchar(255) NULL, \`instagram\` varchar(100) NULL, \`facebook\` varchar(100) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_establishment_type\` (\`type\`), INDEX \`idx_establishment_coordinates\` (\`latitude\`, \`longitude\`), INDEX \`idx_establishment_city\` (\`city\`), INDEX \`idx_establishment_postal_code\` (\`postal_code\`), UNIQUE INDEX \`IDX_d8f1ad14120a034deb390fdd8c\` (\`siret\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`establishment_id\` int NULL, \`email\` varchar(150) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`first_name\` varchar(100) NOT NULL, \`role\` enum ('OWNER', 'EMPLOYEE', 'ADMIN') NOT NULL, \`last_login_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_6620cd026ee2b231beac7cfe57\` (\`role\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier_label\` (\`supplier_id\` int NOT NULL, \`label_id\` int NOT NULL, INDEX \`IDX_4680ce1cf45b10d1188212d02a\` (\`supplier_id\`), INDEX \`IDX_bab54a18a46307adf9725f79a8\` (\`label_id\`), PRIMARY KEY (\`supplier_id\`, \`label_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier_product_category\` (\`supplier_id\` int NOT NULL, \`product_category_id\` int NOT NULL, INDEX \`IDX_eca0def3c5e6e0c6aa9bebc465\` (\`supplier_id\`), INDEX \`IDX_b35ac8055545ebd22bba36404c\` (\`product_category_id\`), PRIMARY KEY (\`supplier_id\`, \`product_category_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`message_attachment\` (\`message_id\` int NOT NULL, \`file_id\` int NOT NULL, INDEX \`IDX_9db9a64915214dde2ca1e8db9a\` (\`message_id\`), INDEX \`IDX_7acc3d624bdcb7d83c7a0f3d65\` (\`file_id\`), PRIMARY KEY (\`message_id\`, \`file_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_attributes\` ADD CONSTRAINT \`FK_b60e5d5ecc9ecc2ecbf3ad5f1b7\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_572c013486c3cafbbdbce570372\` FOREIGN KEY (\`owner_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` ADD CONSTRAINT \`FK_d1c91b5051fee60f7dec722b4af\` FOREIGN KEY (\`target_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_617f9f78f80e82a1cead4523e53\` FOREIGN KEY (\`reviewer_restaurant_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_00657e860d145b0e221fd34be31\` FOREIGN KEY (\`reviewed_supplier_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_c7f84628e427179eed45d8ec840\` FOREIGN KEY (\`restaurant_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_bf7dbefd6bc24cbbe5a3b950bfe\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7fe3e887d78498d9c9813375ce2\` FOREIGN KEY (\`conversation_id\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` ADD CONSTRAINT \`FK_a3698ecb09ff67efe23ad0620a1\` FOREIGN KEY (\`establishment_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` ADD CONSTRAINT \`FK_b9e7d1916962b81f2c3b5b54804\` FOREIGN KEY (\`file_id\`) REFERENCES \`stored_file\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_1a5537f95e495e43744181dc352\` FOREIGN KEY (\`establishment_id\`) REFERENCES \`establishment\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_label\` ADD CONSTRAINT \`FK_4680ce1cf45b10d1188212d02a0\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`supplier_attributes\`(\`supplier_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_label\` ADD CONSTRAINT \`FK_bab54a18a46307adf9725f79a84\` FOREIGN KEY (\`label_id\`) REFERENCES \`label\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_product_category\` ADD CONSTRAINT \`FK_eca0def3c5e6e0c6aa9bebc4653\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`supplier_attributes\`(\`supplier_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_product_category\` ADD CONSTRAINT \`FK_b35ac8055545ebd22bba36404c0\` FOREIGN KEY (\`product_category_id\`) REFERENCES \`product_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_attachment\` ADD CONSTRAINT \`FK_9db9a64915214dde2ca1e8db9a7\` FOREIGN KEY (\`message_id\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_attachment\` ADD CONSTRAINT \`FK_7acc3d624bdcb7d83c7a0f3d650\` FOREIGN KEY (\`file_id\`) REFERENCES \`stored_file\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_attachment\` DROP FOREIGN KEY \`FK_7acc3d624bdcb7d83c7a0f3d650\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message_attachment\` DROP FOREIGN KEY \`FK_9db9a64915214dde2ca1e8db9a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_product_category\` DROP FOREIGN KEY \`FK_b35ac8055545ebd22bba36404c0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_product_category\` DROP FOREIGN KEY \`FK_eca0def3c5e6e0c6aa9bebc4653\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_label\` DROP FOREIGN KEY \`FK_bab54a18a46307adf9725f79a84\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_label\` DROP FOREIGN KEY \`FK_4680ce1cf45b10d1188212d02a0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_1a5537f95e495e43744181dc352\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_b9e7d1916962b81f2c3b5b54804\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_a3698ecb09ff67efe23ad0620a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7fe3e887d78498d9c9813375ce2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_bf7dbefd6bc24cbbe5a3b950bfe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_c7f84628e427179eed45d8ec840\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_00657e860d145b0e221fd34be31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_617f9f78f80e82a1cead4523e53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_d1c91b5051fee60f7dec722b4af\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite\` DROP FOREIGN KEY \`FK_572c013486c3cafbbdbce570372\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_attributes\` DROP FOREIGN KEY \`FK_b60e5d5ecc9ecc2ecbf3ad5f1b7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7acc3d624bdcb7d83c7a0f3d65\` ON \`message_attachment\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9db9a64915214dde2ca1e8db9a\` ON \`message_attachment\``,
    );
    await queryRunner.query(`DROP TABLE \`message_attachment\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b35ac8055545ebd22bba36404c\` ON \`supplier_product_category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_eca0def3c5e6e0c6aa9bebc465\` ON \`supplier_product_category\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_product_category\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bab54a18a46307adf9725f79a8\` ON \`supplier_label\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4680ce1cf45b10d1188212d02a\` ON \`supplier_label\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_label\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6620cd026ee2b231beac7cfe57\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d8f1ad14120a034deb390fdd8c\` ON \`establishment\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_establishment_postal_code\` ON \`establishment\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_establishment_city\` ON \`establishment\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_establishment_coordinates\` ON \`establishment\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_establishment_type\` ON \`establishment\``,
    );
    await queryRunner.query(`DROP TABLE \`establishment\``);
    await queryRunner.query(
      `DROP INDEX \`idx_document_category\` ON \`document\``,
    );
    await queryRunner.query(`DROP TABLE \`document\``);
    await queryRunner.query(`DROP TABLE \`stored_file\``);
    await queryRunner.query(
      `DROP INDEX \`idx_message_is_read_by_recipient\` ON \`message\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_message_sent_at\` ON \`message\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7fe3e887d78498d9c9813375ce\` ON \`message\``,
    );
    await queryRunner.query(`DROP TABLE \`message\``);
    await queryRunner.query(
      `DROP INDEX \`uq_conversation_restaurant_supplier\` ON \`conversation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_conversation_last_message\` ON \`conversation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_c7f84628e427179eed45d8ec84\` ON \`conversation\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bf7dbefd6bc24cbbe5a3b950bf\` ON \`conversation\``,
    );
    await queryRunner.query(`DROP TABLE \`conversation\``);
    await queryRunner.query(
      `DROP INDEX \`uq_review_restaurant_supplier\` ON \`review\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_617f9f78f80e82a1cead4523e5\` ON \`review\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_00657e860d145b0e221fd34be3\` ON \`review\``,
    );
    await queryRunner.query(`DROP TABLE \`review\``);
    await queryRunner.query(
      `DROP INDEX \`uq_favorite_owner_target\` ON \`favorite\``,
    );
    await queryRunner.query(`DROP TABLE \`favorite\``);
    await queryRunner.query(
      `DROP INDEX \`idx_supplier_type\` ON \`supplier_attributes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_supplier_is_premium\` ON \`supplier_attributes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`idx_supplier_is_visible\` ON \`supplier_attributes\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_attributes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_96152d453aaea425b5afde3ae9\` ON \`product_category\``,
    );
    await queryRunner.query(`DROP TABLE \`product_category\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_972f95f212512a35e838562ea3\` ON \`label\``,
    );
    await queryRunner.query(`DROP TABLE \`label\``);
  }
}
