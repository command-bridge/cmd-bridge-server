import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import { ConfigurationDto } from "./configuration.dto";
import { ConfigurationService } from "./configuration.service";

@Controller("config")
export class ConfigurationController {
    constructor(private readonly configurationService: ConfigurationService) {}

    @Post("save")
    @UsePipes(new ValidationPipe({ transform: true }))
    public saveConfig(@Body() configs: ConfigurationDto) {
        return this.configurationService.saveConfig(configs);
    }
}
