import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class DeviceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_hash: string;

    @Column({ default: true })
    is_active: boolean;
}
