import { NestFactory } from "@nestjs/core";
import { join } from "path";
import { existsSync } from "fs";
import { Logger } from "@nestjs/common";

if (!process.env.ASSETS_DIR) {
    process.env.ASSETS_DIR = join(process.cwd(), "assets");
}

async function bootstrap() {
    const isConfigMode = process.env.CONFIG_MODE === "true";
    const envFileExists = existsSync(join(process.env.ASSETS_DIR, ".env"));

    if (isConfigMode && envFileExists) {
        Logger.error(
            "An .env file is detected. Configuration is not necessary. If you want wipe existing installation and start over again, please, remove all the databases and the .env file.",
        );
        process.exit();
    } else if (!isConfigMode && !envFileExists) {
        Logger.error(
            "An .env file is not detected. Please execute `npm run configure` to setup the initial configuration.",
        );
        process.exit();
    }

    const MainModuleLazyLoaded = await (async () => {
        if (isConfigMode) {
            return (
                await import(
                    "./http/modules/configuration/configuration.module"
                )
            ).ConfigurationModule;
        }

        return (await import("./app.module")).AppModule;
    })();

    const app = await NestFactory.create(MainModuleLazyLoaded);
    const allowedOrigins = [
        "http://localhost:8080",
        ...(process.env.CORS_ALLOWED_HOSTS?.split(",") || []),
    ];

    app.enableCors({
        origin: (origin, callback) => {
            // Permitir origens da lista ou requisições sem "origin" (ex: Postman)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET,POST",
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
