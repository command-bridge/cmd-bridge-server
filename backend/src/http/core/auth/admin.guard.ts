import { RequestWithPayload } from "@common/auth/jwt-auth.middlewere";
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithPayload>();
        const user = request.payload;

        if (!user || !user.is_admin) {
            throw new ForbiddenException("Access denied.");
        }

        return true;
    }
}
