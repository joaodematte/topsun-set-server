import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSolarPanelsTable1643568048708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "solarPanels",
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
            name: "outputs",
            type: "int",
            isArray: true,
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
    await queryRunner.dropTable("solarPanels");
  }
}
