import { DataGrid } from "@common/decorators/datagrid.decorator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class DeviceEntity {
    @PrimaryGeneratedColumn()
    @DataGrid({ title: "#ID" })
    id: number;

    @Column()
    @DataGrid({ title: "Device ID" })
    device_hash: string;

    @Column()
    @DataGrid({ title: "Auth Token" })
    integration_token: string;

    @Column({ default: true })
    @DataGrid({ title: "Active" })
    is_active: boolean;
}
