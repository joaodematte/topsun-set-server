import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import solarPanel from "./SolarPanel";

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
