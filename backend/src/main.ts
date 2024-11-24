import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigurationModule } from "@http/modules/configuration/configuration.module";

async function bootstrap() {
    const app = await NestFactory.create(
        process.env.CONFIG_MODE === "true" ? ConfigurationModule : AppModule,
    );

    app.enableCors({
        origin: "http://localhost:8080", // Allow frontend's origin
        methods: "GET,POST",
        credentials: true,
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
