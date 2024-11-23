import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ConnectionRepositoryService } from "./connection-repository.service";
import { GenericEntity } from "@common/entities/generic-entity.type";

@Module({})
export class ConnectionRepositoryModule {
    static forEntity<T>(entity: GenericEntity<T>): DynamicModule {
        const token = `ENVIRONMENT_REPOSITORY_${entity.name}`;

        const provider: Provider = {
            provide: token,
            useFactory: async (
                connectionRepositoryService: ConnectionRepositoryService,
            ) => {
                return await connectionRepositoryService.getRepository(entity);
            },
            inject: [ConnectionRepositoryService],
        };

        return {
            module: ConnectionRepositoryModule,
            providers: [provider],
            exports: [provider],
        };
    }
}
