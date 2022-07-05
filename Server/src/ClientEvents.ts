export type ClientEventTypes = 
"modcmd_event"|
"message"|
"player_pay"|
"player_died"|
"player_leave"|
"player_join"|
"player_vote"|
"server_crash"|
"island_event"

export type ClientEventInterfaces<T extends ClientEventTypes> =
T extends "modcmd_event" ? ModLog :
T extends "message" ? Message :
T extends "player_pay" ? PlayerPay :
T extends "player_died" ? PlayerDied :
T extends "player_leave" ? PlayerBase :
T extends "player_join" ? PlayerBase :
T extends "player_vote" ? PlayerVote :
T extends "island_event" ? IslandEvent :
T extends "server_crash" ? ServerCrash :
null

type IslandEvents =
"player_leave"|
"player_kicked"|
"player_banned"|
"player_invited"|
"player_cooporated"|
"core_upgraded"|
"permission_given"|
"permission_upgraded"|
"drill_placed"|
"cannon_placed"|
"net_placed"|
"cannon_upgraded"|
"drill_destroyed"|
"cannon_destroyed"|
"drill_upgraded"|
"net_destroyed"|
"item_fallen"|
"spawner_placed"|
"spawner_upgraded"|
"spawner_removed"

type Ranks = 
"defender"|
"warrior"|
"guardian"|
"preserver"|
"challenger"|
"staff"

type InGameStaffRoles = 
"helper"|
"mod"|
"jrmod"|
"srmod"|
"coowner"|
"owner"


// export class ClientEvent{}

// export class Coordinates {
//     x: number
//     y: number
//     z: number
// }

// export class PlayerBase {
//     player:
// }

// export class Message extends PlayerBase {}
export interface ClientEvent
{  
    event_type: ClientEventTypes
    event: PlayerBase|Message|ModLog|PlayerPay|PlayerVote|IslandEvent
}

export interface Coordinates {
    x: number,
    y: number,
    z: number
}

export interface PlayerBase {
    player: string
    isNew?: boolean
}

export interface Message extends PlayerBase
{
    message: string
}

export interface ModLog 
{
    staff: string
    command: string
    role: InGameStaffRoles
    output: string
}

export interface PlayerPay 
{
    receiver: string
    payer: string
    amount: string
}

export interface PlayerVote extends PlayerBase
{
    votePlace: number
}

export interface IslandEvent 
{
    id: string
    event: IslandEvents
}

export interface PlayerDied extends Coordinates, PlayerBase
{
    lastDamager: string
    reason: string
}

export interface ServerCrash 
{
    reason: string
}

export function isValidEvent(eventType:ClientEventTypes, event:any): boolean {
    switch (eventType) {
        case 'player_leave':
        case 'player_join':
            {
                return typeof event.player === 'string';
            }
        case 'island_event':
            return (
                typeof event.id === 'string' &&
                typeof event.type === 'string' &&
                typeof event.event === 'object' &&
                isValidIslandEvent(event.type, event.event)
            )
        case 'message':
            return typeof event.player === 'string' && typeof event.message === 'string';
        case 'modcmd_event':
            return (
                typeof event.player === 'string' &&
                typeof event.role === 'string' &&
                typeof event.command === 'string' &&
                typeof event.result === 'string' &&
                isValidStaffRole(event.role)
            );
        case 'player_died':
            return (
                typeof event.player === 'string' &&
                typeof event.lastDamager === 'string' &&
                typeof event.cause === 'string' 
            );
        case 'player_pay':
            return (
                typeof event.reciever === 'string' &&
                typeof event.payer === 'string' &&
                typeof event.amount === 'number'
            );
        case 'player_vote':
            return (
                typeof event.player === 'string' &&
                typeof event.currPlace === 'string'
            );
        case 'server_crash':
            return (
                typeof event.reason === 'string'
            );
        default:
            return false
    }
}
function isValidIslandEvent(eventType:IslandEvents, event:any):boolean {
    switch (eventType) {
        case 'cannon_destroyed':
        case 'drill_placed':
        case 'drill_upgraded':
        case 'drill_destroyed':
        case 'cannon_upgraded':
        case 'cannon_placed':
        case 'net_destroyed':
        case 'net_placed':
        {    
            return (
                typeof event.level === "number" &&
                typeof event.owner === 'string' &&
                typeof event.location === 'object' &&
                isValidCoordinates(event.location)
            )
        }
        case 'item_fallen':
            return (
                typeof event.item === 'string' &&
                typeof event.location === 'string' &&
                isValidCoordinates(event.location)
            )
        case 'spawner_upgraded':
        case 'spawner_removed':
        case 'spawner_placed':
        {    
            return (
                typeof event.level === "number" &&
                typeof event.type === 'string' &&
                typeof event.location === 'object' &&
                isValidCoordinates(event.location)
            )
        }
        case 'player_banned':
        case 'player_kicked':
        case 'player_cooporated':
        case 'player_invited':
        {
            return (
                typeof event.member === 'string' &&
                typeof event.player === 'string'
            )
        }
        case 'permission_given':
        case 'permission_upgraded':
        {
            return (
                typeof event.permission === 'string' &&
                typeof event.member === 'string'
            )
        }
        case 'core_upgraded':
        {
            return (
                typeof event.core === 'number' &&
                typeof event.upgrader === 'string'
            )
        }
        default:
            return false
    }
}
function isValidCoordinates(coords:Coordinates) {
    return (
        typeof coords.x === 'number' &&
        typeof coords.y === 'number' &&
        typeof coords.z === 'number'
    )
}
function isValidStaffRole(role:InGameStaffRoles):boolean {
    return (
        role === 'helper' ||
        role === 'coowner' ||
        role === 'jrmod' ||
        role === 'mod' ||
        role === 'owner' ||
        role === 'srmod'
    )
}
console.log(isValidIslandEvent('cannon_upgraded', {
    level: 1,
    owner: 'lay',
    location: {
        x: 1,
        y: 2,
        z: 3,
    }
}))