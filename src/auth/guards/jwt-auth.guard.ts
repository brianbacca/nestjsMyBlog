import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class  JwtAuthGuard extends AuthGuard('jwt'){
    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
          throw err || new UnauthorizedException("eH manchita que no estas autorizado que te voy a dar mandaga pira ya");
        }
        return user;
      }
    }
