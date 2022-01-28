import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("manufacturers")
class Manufacturer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column("integer")
  productsType: number;
}

export default Manufacturer;
