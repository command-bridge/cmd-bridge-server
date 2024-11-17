import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("environments")
export class EnvironmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    db_host: string;

    @Column()
    db_port: number;

    @Column()
    db_type: string;

    @Column()
    db_user: string;

    @Column()
    db_password: string;

    @Column()
    db_database: string;
}
