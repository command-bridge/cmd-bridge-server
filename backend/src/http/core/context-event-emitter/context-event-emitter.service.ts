import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable({ scope: Scope.REQUEST })
export class ContextEventEmitterService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @Inject(REQUEST) private readonly request: RequestWithPayload,
    ) {}

    public emitAsync(event: string, payload: any) {
        const contextPayload = { ...payload, payload: this.request.payload };

        return this.eventEmitter.emitAsync(event, contextPayload);
    }
}
