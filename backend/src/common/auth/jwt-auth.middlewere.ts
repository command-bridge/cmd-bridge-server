import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtTokenPayloadDto } from "./jwt-token-payload.dto";
import { JwtAuthService } from "./jwt-auth.service";
import { Request } from "express";

export type DecodeTokenResult = {
    payload: JwtTokenPayloadDto | string | null;
    error: Error | null;
};

export type RequestWithPayload = Request & {
    payload: JwtTokenPayloadDto;
    tokenDecoded: boolean;
    tokenDecodedError: Error;
};

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtAuthService) {}

    use(req: RequestWithPayload, res: any, next: () => void) {
        const decoded = this.decodeTokenFromHeader(req);

        if (decoded.payload || decoded.error) {
            if (decoded.payload) {
                req.payload = decoded.payload as any;
                req.tokenDecoded = true;
            } else if (decoded.error) {
                req.tokenDecoded = false;
                req.tokenDecodedError = decoded.error;
            }

            next();
            return;
        }

        const decodedFromQueryParams = this.decodeTokenFromQueryParams(req);

        if (decodedFromQueryParams.payload) {
            req.payload = decodedFromQueryParams.payload as any;
            req.tokenDecoded = true;
        } else if (decodedFromQueryParams.error) {
            req.tokenDecoded = false;
            req.tokenDecodedError = decodedFromQueryParams.error;
        }

        next();
    }

    private decodeTokenFromHeader(req: RequestWithPayload): DecodeTokenResult {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return {
                    payload: null,
                    error: null,
                };
            }

            const token = authHeader.split(" ")[1];

            return {
                payload: this.jwtService.validateToken(token),
                error: null,
            };
        } catch (error) {
            return {
                payload: null,
                error: error,
            };
        }
    }

    private decodeTokenFromQueryParams(
        req: RequestWithPayload,
    ): DecodeTokenResult {
        try {
            const token = req.query.token as string;

            if (!token) {
                return {
                    payload: null,
                    error: null,
                };
            }

            return {
                payload: this.jwtService.validateToken(token),
                error: null,
            };
        } catch (error) {
            return {
                payload: null,
                error: error,
            };
        }
    }
}
