import { Module } from "@nestjs/common";
import { ContextEventEmitterService } from "./context-event-emitter.service";

@Module({
    providers: [ContextEventEmitterService],
    exports: [ContextEventEmitterService],
})
export class ContextEventEmitterModule {}
