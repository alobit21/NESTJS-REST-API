import { Controller, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";


@Module({

    
controllers: [AuthController],
imports:[
    
    JwtModule.register({}),
    

],
providers:[
    AuthServices,
    JwtStrategy

]



})




export class AuthModule{}