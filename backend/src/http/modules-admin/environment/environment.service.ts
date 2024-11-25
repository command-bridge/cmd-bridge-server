import { EnvironmentEntity } from "@common/entities/admin/environment.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class EnvironmentService {
    constructor(
        @InjectRepository(EnvironmentEntity)
        private readonly environmentRepository: Repository<EnvironmentEntity>,
    ) {}

    public getAll() {
        return this.environmentRepository.find();
    }
}
