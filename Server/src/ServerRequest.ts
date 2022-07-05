type RequestTypes = 
"warn_player"|
"pay_player"|
"get_player"|
"get_island"|
"give_player"|
"kick_player"|
"permanently_ban_player"|
"temporarily_ban_player"|
null;

type PlayerRequestTypes = "xuid"|"island"|"money"|"kills"|"discord"|"rank"|"playtime"|"pet"|"*"

type IslandRequestTypes = "members"|"id"|"core"|"bans"|"spawners"|"machines"|"*"

type requests<T extends RequestTypes> = 
T extends "warn_player" ? WarnPlayerRequest:
T extends "pay_player" ? PayPlayerRequest:
T extends "get_player" ? GetPlayerRequest:
T extends "permanently_ban_player" ? PermBanPlayerRequest:
T extends "temporarily_ban_player" ? TempBanPlayerRequest:
T extends "get_island" ? GetIslandRequest:
T extends "kick_player" ? KickPlayerRequest : null;

interface TempBanTime {
    days: number,
    hours: number,
    minutes: number
}

interface WarnPlayerRequest {
    player: string,
    staff: string,
    reason: string
}

interface PayPlayerRequest {
    player: string,
    staff: string,
    amount: number
}

interface PermBanPlayerRequest {
    player: string,
    staff: string,
    reason: string
}

interface TempBanPlayerRequest {
    player: string,
    staff: string,
    reason: string,
    time: TempBanTime
}

interface KickPlayerRequest {
    player: string,
    staff: string,
    reason: string
}

interface GetPlayerRequest {
    player: string,
    specify: PlayerRequestTypes
}

interface GetIslandRequest {
    island: string,
    specify: IslandRequestTypes
}

export class ServerRequest<T extends RequestTypes>{
    constructor(private id:number, private request_type:T, private request:requests<T>) {}
    stringify() {
        return JSON.stringify(this)
    }
    
}
