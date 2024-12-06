import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("environments")
export class EnvironmentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    db_host: string;

    @Column({ nullable: true })
    db_port: number;

    @Column()
    db_type: string;

    @Column()
    db_user: string;

    @Column()
    db_password: string;

    @Column({ nullable: true })
    db_database: string;

    @Column({ nullable: true })
    hashed_id: string;

    @Column("simple-json", { default: null })
    custom_parameters: Record<string, number | string | Date | boolean>;
}
