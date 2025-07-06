import { Body, Controller, Post } from "@nestjs/common/decorators";
import { AuthServices } from "./auth.service";
import { AuthDto } from "./dto";
import { hash } from "argon2";


@Controller('auth')
export class AuthController {

    constructor(private authService : AuthServices){}

    @Post('signup')
    signup(@Body() dto: AuthDto){
        console.log({
            dto,
        })
       return this.authService.signup(dto);

    }

    @Post('signin')
    signin(@Body() dto: AuthDto){
        console.log({
            dto,
        })
        return this.authService.login(dto);
    }

}

function req(target: AuthController, propertyKey: "signup", parameterIndex: 0): void {
    throw new Error("Function not implemented.");
}
