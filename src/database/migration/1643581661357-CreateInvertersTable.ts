import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateInvertersTable1643581661357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "inverters",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "model",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "activePower",
            type: "int",
          },
          {
            name: "manufacturerId",
            type: "uuid",
          },
          {
            name: "manufacturerName",
            type: "varchar",
          },
        ],
        foreignKeys: [
          {
            name: "fkSolarPanelManufacturer",
            columnNames: ["manufacturerId"],
            referencedTableName: "manufacturers",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("inverters");
  }
}
