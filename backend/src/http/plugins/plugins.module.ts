/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-require-imports */
import { DynamicModule, Logger, Module } from "@nestjs/common";
import { readdirSync, statSync } from "fs";
import { join } from "path";

@Module({})
export class PluginsModule {
    private static pluginEntities: Function[] = []; // Array privado para armazenar as entidades

    /**
     * Registra uma entidade vinda de um plugin.
     */
    static registerPluginEntity(entity: Function): void {
        this.pluginEntities.push(entity);
    }

    /**
     * Retorna as entidades registradas pelos plugins.
     */
    static getPluginEntities(): Function[] {
        Logger.log(
            `Discovered entities ${this.pluginEntities.length}`,
            PluginsModule.name,
        );

        return this.pluginEntities;
    }

    /**
     * Carrega e registra módulos de plugins dinamicamente.
     */
    static forRoot(): DynamicModule {
        const pluginsDir = join(__dirname); // Diretório raiz dos plugins
        const pluginModules = [];

        // Lê os subdiretórios no diretório de plugins
        const subdirectories = readdirSync(pluginsDir).filter((item) => {
            const fullPath = join(pluginsDir, item);
            return statSync(fullPath).isDirectory(); // Verifica se é um diretório
        });

        // Procura arquivos .plugin.js em cada subdiretório
        subdirectories.forEach((subdir) => {
            const subdirPath = join(pluginsDir, subdir);
            const pluginFiles = readdirSync(subdirPath).filter((file) =>
                file.endsWith(".plugin.js"),
            );

            pluginFiles.forEach((file) => {
                const pluginPath = join(subdirPath, file);
                const pluginModule = require(pluginPath); // Importa o módulo dinamicamente

                Logger.log(
                    `Loading plugin module from ${subdir}`,
                    PluginsModule.name,
                );

                // Pega o export default ou o primeiro export
                const moduleToLoad =
                    pluginModule.default ||
                    pluginModule[Object.keys(pluginModule)[0]];
                if (moduleToLoad) {
                    pluginModules.push(moduleToLoad);

                    // Verifica se o módulo expõe entidades
                    if (pluginModule.ENTITIES) {
                        pluginModule.ENTITIES.forEach((entity: Function) =>
                            this.registerPluginEntity(entity),
                        );
                    }
                }
            });
        });

        return {
            module: PluginsModule,
            imports: pluginModules, // Registra os módulos dinamicamente
        };
    }
}
