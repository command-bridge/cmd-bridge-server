import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    user_name: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    group_id: number;

    @Column()
    environment_id: number;
}
