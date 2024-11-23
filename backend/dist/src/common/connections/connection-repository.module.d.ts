import { DynamicModule } from "@nestjs/common";
import { GenericEntity } from "@common/entities/generic-entity.type";
export declare class ConnectionRepositoryModule {
    static forEntity<T>(entity: GenericEntity<T>): DynamicModule;
}
