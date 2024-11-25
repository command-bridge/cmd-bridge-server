import { DynamicModule, Module, Provider, Scope } from "@nestjs/common";
import { ConnectionRepositoryService } from "./connection-repository.service";
import { GenericEntity } from "@common/entities/generic-entity.type";
import { ConnectionsModule } from "./connections.module";

@Module({
    imports: [ConnectionsModule],
})
export class ConnectionRepositoryModule {
    static forEntity<T>(entity: GenericEntity<T>): DynamicModule {
        const token = `ENVIRONMENT_REPOSITORY_${entity.name}`;

        const provider: Provider = {
            provide: token,
            useFactory: async (
                connectionRepositoryService: ConnectionRepositoryService,
            ) => {
                return async () => {
                    return await connectionRepositoryService.getRepository(
                        entity,
                    );
                };
            },
            inject: [ConnectionRepositoryService],
            scope: Scope.REQUEST,
        };

        return {
            module: ConnectionRepositoryModule,
            providers: [provider],
            exports: [provider],
        };
    }
}
