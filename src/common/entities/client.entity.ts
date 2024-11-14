import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("clients")
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_hash: string;

    @Column({ default: true })
    isActive: boolean;
}
