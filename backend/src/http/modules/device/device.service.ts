import { BadRequestException, Injectable } from "@nestjs/common";
import { DeviceActivationDto, DeviceLoginDto } from "./device.dto";
import { JwtAuthService } from "@common/auth/jwt-auth.service";
import { MemoryDeviceActivationRepository } from "@common/shared-memory/memory-repositories/device-activation.repostiory";
import { DeviceEntity } from "@common/entities/environment/device.entity";
import { ConnectionRepositoryService } from "@common/connections/connection-repository.service";
import { generateIntegrationToken } from "@common/helpers/generate-integration-token.helper";
import { hashString } from "@common/helpers/hash-string.helper";
import { Repository } from "typeorm";
import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";
import { OnlineDevicesRepository } from "@common/shared-memory/environment-memory/repositories/online-devices.memory";
import { getDataGridColumns } from "@common/decorators/datagrid.decorator";
import { DeviceEmitters } from "./device-emitters.enum";
import { ContextEventEmitterService } from "@http/core/context-event-emitter/context-event-emitter.service";

@Injectable()
export class DeviceService {
    constructor(
        private readonly connectionRepositoryService: ConnectionRepositoryService,
        private readonly memoryActivationRepository: MemoryDeviceActivationRepository,
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
        private readonly jwtAuthService: JwtAuthService,
        private readonly environmentConnection: ConnectionRepositoryService,
        private readonly onlineDevicesRepository: OnlineDevicesRepository,
        private readonly contextEventEmitterService: ContextEventEmitterService,
    ) {}

    public async activate(deviceActivationDto: DeviceActivationDto) {
        const memoryDeviceActivation =
            await this.memoryActivationRepository.validate(
                deviceActivationDto.activation_code,
            );

        if (!memoryDeviceActivation) {
            throw new BadRequestException("Activation token is invalid");
        }

        const { environment_id } = memoryDeviceActivation;

        const deviceRepository =
            await this.connectionRepositoryService.getRepository(
                DeviceEntity,
                environment_id,
            );

        const token = generateIntegrationToken();

        const device = {
            device_hash: deviceActivationDto.device_hash,
            integration_token: token.hash,
        } as DeviceEntity;

        await deviceRepository.save(device);

        return {
            integration_token: token.integration_token,
            environment: hashString(environment_id.toString()),
        };
    }

    public create() {
        return this.memoryActivationRepository.create();
    }

    public async login(deviceLoginDto: DeviceLoginDto) {
        const {
            environment: hashed_id,
            device_hash,
            integration_token,
        } = deviceLoginDto;

        const environment = await this.environmentRepository.findOneByOrFail({
            hashed_id,
        });

        const deviceRepository =
            await this.connectionRepositoryService.getRepository(
                DeviceEntity,
                environment.id,
            );

        const device = await deviceRepository.findOneByOrFail({
            device_hash,
            integration_token: hashString(integration_token),
        });

        return {
            token: this.jwtAuthService.generateToken({
                environment_id: environment.id,
                id: device.id,
                type: JwtTokenType.Device,
                is_admin: false,
            }),
        };
    }

    public async getAll() {
        const repository =
            await this.environmentConnection.getRepository(DeviceEntity);
        const devices = (await repository.find()).map((device) => {
            device.integration_token = device.integration_token
                .slice(0, 5)
                .concat("...");

            device["is_online"] = this.onlineDevicesRepository.get(
                device.id.toString(),
            )
                ? true
                : false;

            return device;
        });

        const columns = getDataGridColumns(DeviceEntity);

        await this.contextEventEmitterService.emitAsync(
            DeviceEmitters.FindAllDevices,
            {
                columns,
                devices,
            },
        );

        columns.push({ key: "is_online", title: "Online?" });
        columns.push({ key: "actions", title: "Actions", align: "end" } as any);

        return {
            columns,
            data: devices,
        };
    }
}
