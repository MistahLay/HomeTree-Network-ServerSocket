import net from 'net'
import BSON, {deserializeStream, deserialize, serialize} from 'bson'
import { EventEmitter } from 'events'
import * as fs from 'fs/promises'
import { triggerAsyncId } from 'async_hooks'
import { Packet, Verify } from './Packet'
type NetworkServerEvents = "client_login"|"client_leave"|"start"|"shutdown"|"crash"|"client_send_data";
type NetworkServerEvent<T extends NetworkServerEvents> = 
T extends "shutdown" ? null :
T extends "crash" ? string : 
T extends "start" ? null :
T extends "client_login" ? number :
T extends "client_send_data" ? number : never
interface NetworkServer {
    on<T extends NetworkServerEvents>(eventType:T, event:(event: NetworkServerEvent<T>)=>void):this
}
class NetworkServer extends EventEmitter {
    public server:net.Server;
    private clients:{
        [key:string]:net.Socket
    } = {};
    private clientsIdentification:{
        [key:string]:string
    } = {};
    constructor(){
        super()
        this.server = new net.Server()
        this.registerClients()
        this.listenClientsConnection()
        this.start(8080, "localhost")
    }
    private async registerClients() {
        const ClientsFolder = await fs.readdir('./Clients')
        ClientsFolder.forEach(async value => {
            try {
                const clientPassword = await fs.readFile(`./Clients/${value}/Password.txt`)
                if(this.clientsIdentification[value]) return;
                this.clientsIdentification[value] = clientPassword.toString()
            } catch (error) {
            return
        }
    })
    }
    private listenClientsConnection(){
        this.server.on('connection', client => {
            client.on('error', () => {
                this.removeClient(client)
            })
            console.log("Client connecting...")
            client.write("Pls insert Json verification: ")
            client.once('data', async data => {
            try {
                const json = JSON.parse(data.toString())
                if(!(this.clientsIdentification[json.name] === json.password)) {
                    client.write("Invalid name or password")
                    return client.destroy()
                }
                if(this.clients[json.name]) {
                    client.write("A client is already using that profile")
                    return client.destroy()
                }
                this.clients[json.name] = client
                this.listenSentData(client)                
                client.write("You have successfully logined")
                console.log("Client Connected")
                return true
            } catch (error) {
                console.log(error)
                console.log('Invalid')
                client.destroy(new Error("Invalid json"))
            }
            })
            client.once('close', err => {
                this.removeClient(client)
                console.log("closed Connection")
            })
        })
    }
    removeClient(client:net.Socket){
        const key = Object.keys(this.clients).find(key => this.clients[key] === client)
        if(key){
            delete this.clients[key]
        }
    }
    start(port: number, host: string){
        this.server.listen(port, host)
        return this
    } 
    private listenSentData(client:net.Socket){
        client.on('data', data => {
            try {
                const json:Packet = JSON.parse(data.toString())
                if(Verify(json)){
                    json.sendTo.forEach(clientName => {
                        const fakeJson:{[key: string]:any} = json
                        const clientSock = this.clients[clientName]
                        if(!(clientSock instanceof net.Socket)) {
                            client.write('Error')
                            return
                        }
                        delete fakeJson.sendTo
                        fakeJson.from = clientName
                        clientSock.write(JSON.stringify(fakeJson))
                    });
                }
            } catch (error) {
                client.write("JSON error")
            }

        })
    } 
}
new NetworkServer()