import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Manufacturer from "./Manufacturer";

@Entity("inverters")
class Inverter {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  model: string;

  @Column("int")
  activePower: number;

  @Column("text")
  manufacturerId: string;

  @Column("text")
  manufacturerName: string;

  @ManyToOne(() => Manufacturer)
  @JoinColumn({ name: "manufacturerId" })
  manufacturer: Manufacturer;
}

export default Inverter;
