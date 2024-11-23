"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let ConnectionManagerService = class ConnectionManagerService {
    constructor() {
        this.connections = new Map();
    }
    async getConnection(config) {
        const key = `${config.type}-${config.host}-${config.database}`;
        if (!this.connections.has(key)) {
            const dataSource = new typeorm_1.DataSource(config);
            await dataSource.initialize();
            this.connections.set(key, dataSource);
        }
        return this.connections.get(key);
    }
    async closeConnections() {
        for (const connection of this.connections.values()) {
            await connection.destroy();
        }
        this.connections.clear();
    }
};
exports.ConnectionManagerService = ConnectionManagerService;
exports.ConnectionManagerService = ConnectionManagerService = __decorate([
    (0, common_1.Injectable)()
], ConnectionManagerService);
//# sourceMappingURL=connection-manager.service.js.map