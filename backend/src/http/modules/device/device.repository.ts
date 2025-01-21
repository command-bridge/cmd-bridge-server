import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import {
    DatagridColumn,
    getDataGridColumns,
} from "@common/decorators/datagrid.decorator";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import { OnlineDevicesRepository } from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import { ContextEventEmitterService } from "@http/core/context-event-emitter/context-event-emitter.service";
import { Injectable } from "@nestjs/common";
import { DeviceEmitters } from "./device-emitters.enum";

@Injectable()
export class DeviceRepository {
    constructor(
        private readonly environmentConnection: ConnectionRepositoryService,
        private readonly onlineDevicesRepository: OnlineDevicesRepository,
        private readonly contextEventEmitterService: ContextEventEmitterService,
    ) {}

    public async getOne(id: number) {
        const repository =
            await this.environmentConnection.getRepository(DeviceEntity);
        const devices = [await repository.findOneByOrFail({ id })];

        return (await this.getAsDatagrid(devices)).data[0];
    }

    public async getAll() {
        const repository =
            await this.environmentConnection.getRepository(DeviceEntity);
        const devices = await repository.find();

        return this.getAsDatagrid(devices);
    }

    private async getAsDatagrid(devices: DeviceEntity[]) {
        const columns = await this.fillAdditionalInformations(devices);

        return {
            columns,
            data: devices,
        };
    }

    private async fillAdditionalInformations(devices: DeviceEntity[]) {
        const columns = getDataGridColumns(DeviceEntity);

        this.fillOnlineInformations(devices, columns);

        await this.fillPluginInformations(devices, columns);

        return columns;
    }

    private fillOnlineInformations(
        devices: DeviceEntity[],
        columns: DatagridColumn[],
    ) {
        columns.push({ key: "is_online", title: "Online?" });
        columns.push({ key: "version", title: "Version" });
        columns.push({ key: "actions", title: "Actions", align: "end" } as any);

        devices.forEach((device) => {
            const onlineDevice = this.onlineDevicesRepository.get(device.id);

            device["is_online"] = onlineDevice ? true : false;

            if (device["is_online"])
                device["version"] = onlineDevice.clientVersion;
        });
    }

    private async fillPluginInformations(
        devices: DeviceEntity[],
        columns: DatagridColumn[],
    ) {
        await this.contextEventEmitterService.emitAsync(
            DeviceEmitters.FindAllDevices,
            {
                columns,
                devices,
            },
        );
    }
}
