import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientActivationDto } from "./client-device-activation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientEntity } from "../../../common/entities/client.entity";
import { Repository } from "typeorm";
import { JwtAuthService } from "../../../common/auth/jwt-auth.service";

@Injectable()
export class ClientDeviceService {
    constructor(
        private readonly jwtService: JwtAuthService,
        @InjectRepository(ClientEntity)
        private clientRepository: Repository<ClientEntity>,
    ) {}

    public async deviceActivation(clientActivationDto: ClientActivationDto) {
        if (clientActivationDto.activationCode !== "123456") {
            throw new BadRequestException("Activation token is invalid");
        }

        const client = await this.clientRepository.save(
            clientActivationDto as unknown as ClientEntity,
        );

        return this.jwtService.generateToken({ id: client.id });
    }
}
