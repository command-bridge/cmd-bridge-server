import {
    Injectable,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtTokenType } from "@common/auth/jwt-token-type.enum";
import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";

@Injectable()
export class DeviceGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithPayload>();
        const tokenDecoded = request.tokenDecoded;
        const payload = request.payload;

        if (!tokenDecoded || payload.type !== JwtTokenType.Device) {
            throw new ForbiddenException("Access denied.");
        }

        return true;
    }
}
