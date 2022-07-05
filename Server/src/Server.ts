import net from 'net'
import {deserializeStream, deserialize, serialize} from 'bson'
import {ServerRequest} from './ServerRequest'
import { EventEmitter } from 'events'

type NetworkServerEvents = "client_login"|"client_leave"|"start"|"shutdown"|"crash";
type NetworkServerEvent<T extends NetworkServerEvents> = 
T extends "shutdown" ? null :
T extends "crash" ? string : 
T extends "start" ? null : never
interface NetworkServer {
    on<T extends NetworkServerEvents>(eventType:T, event:(event: NetworkServerEvent<T>)=>void):this
}

class NetworkServer extends EventEmitter {
    
}