import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2'
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { error } from "console";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { access } from "fs";



@Injectable()
export class AuthServices {

constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService

){}

async signup( dto:AuthDto){
    //generate the password hash

    const hash = await argon.hash(dto.password);


try{
    const user = await this.prisma.user.create({

        data:{
            email:dto.email,
            hash
        
        }
    })

    //save the new user in the db

    
}catch(error){
    if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002'){
            throw new ForbiddenException('Credential taken')
        }
    }
}
throw error;

}


async login(dto:AuthDto){

    const user = await this.prisma.user.findUnique({
        where:{
        email:dto.email,
        }
    });

    if(!user)
        throw new ForbiddenException(
            'Credentials incorrect',
    );

    //compare passwords

    const pwMatches = await argon.verify(
        user.hash,
        dto.password
    );

    if(!pwMatches)
        throw new ForbiddenException(
    'Credentials incorrect',
        );

     
    return  this.signToken(user.id, user.email);
}

 async signToken(
    userId: number,
    email:string): Promise<{ access_token: string;}>{
    const payload = {
        sub: userId,
        email
    };

    const secret=this.config.get('JWT_SECRET')

    
    const token =  await this.jwt.signAsync(payload,{
        expiresIn: '15m',
        secret: secret,
    });

    return {
        access_token: token,
    };
}

 
}

