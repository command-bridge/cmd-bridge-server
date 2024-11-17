import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mem_device_creation")
export class MemoryDeviceActivation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    environment_id: number;

    @Column()
    activation_code: string;

    @Column()
    expires_in: Date;
}
