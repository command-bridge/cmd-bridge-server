import { DeviceEntity } from "@common/entities/environment/device.entity";
import { Injectable, Logger, Scope } from "@nestjs/common";
import { MemoryRepository } from "../../memory-repository.class";
import { Subject } from "rxjs";
import { REQUEST } from "@nestjs/core";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";

export interface SubjectMessage {
    action: string;
    payload?: Record<string, any> | string;
}

export interface OnlineDevice {
    device: DeviceEntity;
    environmentId: number;
    lastLogin: Date;
    clientVersion: string;
    subject?: Subject<SubjectMessage>;
}

@Injectable()
export class OnlineDevicesRepository extends MemoryRepository<OnlineDevice> {
    private static instances: Map<number, OnlineDevicesRepository> = new Map();

    static getInstance(environmentId: number): OnlineDevicesRepository {
        if (!this.instances.has(environmentId)) {
            this.instances.set(
                environmentId,
                new OnlineDevicesRepository(environmentId),
            );
        }

        return this.instances.get(environmentId);
    }
}

export const ONLINE_DEVICES_REPOSITORY_PROVIDER = {
    provide: OnlineDevicesRepository,
    scope: Scope.REQUEST,
    useFactory: (request: RequestWithPayload) => {
        const environment_id = request.payload?.environment_id;

        if (!environment_id) {
            return new Proxy(
                {},
                {
                    get: (target, p) => {
                        if (p === "then") {
                            return;
                        }

                        Logger.error(
                            "Attempted to use OnlineDevicesRepository without a valid environment_id. Ensure your request includes a valid JWT token or query parameter.",
                            OnlineDevicesRepository.name,
                        );
                        throw new Error(
                            `OnlineDevicesRepository.${String(p)} cannot be used without a valid environment_id`,
                        );
                    },
                },
            );
        }

        return OnlineDevicesRepository.getInstance(environment_id);
    },
    inject: [REQUEST],
};
