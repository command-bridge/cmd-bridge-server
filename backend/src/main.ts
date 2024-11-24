import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigurationModule } from "@http/modules/configuration/configuration.module";
import { join } from "path";
import { existsSync } from "fs";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const isConfigMode = process.env.CONFIG_MODE === "true";
    const envFileExists = existsSync(join(process.cwd(), ".env"));

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

    const app = await NestFactory.create(
        isConfigMode ? ConfigurationModule : AppModule,
    );

    app.enableCors({
        origin: "http://localhost:8080", // Allow frontend's origin
        methods: "GET,POST",
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
