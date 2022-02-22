import { OmitType } from "@nestjs/mapped-types";
import { CreateUserDto } from ".";

export class UserRegistrationDto extends OmitType(CreateUserDto, [
    'roles',
  ] as const) {}