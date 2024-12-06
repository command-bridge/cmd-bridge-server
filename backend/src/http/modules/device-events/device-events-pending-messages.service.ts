import { Injectable } from "@nestjs/common";
import { randomUUID, UUID } from "crypto";
import { IPackageMethodResponse } from "./device-events.controller";

export type PendingMessage = {
    uuid: UUID;
    promise: Promise<unknown>;
};

@Injectable()
export class DeviceEventsPendingMessagesService {
    private pendingMessages = new Map<UUID, (response: any) => void>();

    public createPendingMessage(): PendingMessage {
        const uuid = randomUUID();
        const promise = new Promise((resolve) => {
            this.pendingMessages.set(uuid, resolve);
        });

        return {
            promise,
            uuid,
        };
    }

    public resolvePendingMessage(
        packageResponse: IPackageMethodResponse,
    ): void {
        const resolver = this.pendingMessages.get(packageResponse.uuid);
        if (resolver) {
            resolver(packageResponse);
            this.pendingMessages.delete(packageResponse.uuid);
        }
    }

    public hasPendingMessage(packageResponse: IPackageMethodResponse): boolean {
        return this.pendingMessages.has(packageResponse.uuid);
    }
}
