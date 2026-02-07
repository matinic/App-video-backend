import { PrismaClient } from "@prisma/client"
export default class PlaylistService{
    constructor(private prisma:PrismaClient){}
    async createPlaylist(): Promise<void>{}
}