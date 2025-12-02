import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        // console.log(request);
        const user = request.user;
        return matchRoles(roles, user.role);
    }
}

function matchRoles(requiredRoles: string[], userRole: string): boolean {
    if (!userRole) {
        return false;
    }
    return requiredRoles.includes(userRole);
}