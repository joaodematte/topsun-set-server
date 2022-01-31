import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Manufacturer from "./Manufacturer";

@Entity("solarPanels")
class SolarPanel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  model: string;

  @Column("int", { array: true })
  outputs: number[];

  @Column("text")
  manufacturerId: string;

  @Column("text")
  manufacturerName: string;

  @ManyToOne(() => Manufacturer)
  @JoinColumn({ name: "manufacturerId" })
  manufacturer: Manufacturer;
}

export default SolarPanel;
