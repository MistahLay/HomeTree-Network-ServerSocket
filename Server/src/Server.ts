import net from 'net'
import {deserializeStream, deserialize, serialize} from 'bson'
import {ServerRequest} from './ServerRequest'
import { EventEmitter } from 'events'
import * as fs from 'fs/promises'
import { triggerAsyncId } from 'async_hooks'
type NetworkServerEvents = "client_login"|"client_leave"|"start"|"shutdown"|"crash";
type NetworkServerEvent<T extends NetworkServerEvents> = 
T extends "shutdown" ? null :
T extends "crash" ? string : 
T extends "start" ? null : never
interface NetworkServer {
    on<T extends NetworkServerEvents>(eventType:T, event:(event: NetworkServerEvent<T>)=>void):this
}
class NetworkServer extends EventEmitter {
    public server:net.Server;
    private clients:{
        clientName: string
        sock: net.Socket
    }[] = [];
    private clientsPassword:{
        password:string,
        clientName:string
    }[] = [];
    constructor(){
        super()
        this.server = new net.Server()
        this.registerClients()
        this.listenClientsConnection()
        this.handleErrors()
        this.start(8080, "localhost")
    }
    private async registerClients() {
        const ClientsFolder = await fs.readdir('./Clients')
         ClientsFolder.forEach(async value => {
            console.log(value)
            try {
                const clientPassword = await fs.readFile(`./Clients/${value}/Password.txt`)
                this.clientsPassword.forEach(({password}) => {
                    if(password === clientPassword.toString()){
                        throw new Error("Password is already been taken");
                    }
                })
                this.clientsPassword.push({
                    password: clientPassword.toString(),
                    clientName: value
                })
            } catch (error) {
                console.log(error)
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
            client.write("Pls add input password ")
            client.once('data', async data => {
            try {
                const clientName = await this.checkIfValidPassword(data.toString())
                this.clients.push({clientName:clientName,sock:client})
                this.emit('client_login', client)

                console.log('Client has been successfully logined as ' + clientName)
                client.write("You have successfully logined as " + clientName)
                return true
            } catch (error) {
                client.write("Invalid password")
                console.log('Invalid')
                client.destroy()
            }
            })
            client.once('close', err => {
                this.removeClient(client)
                console.log("closed Connection")
            })
        })
    }
    removeClient(client:net.Socket){
        this.clients.forEach(({clientName, sock}, index) => {
            if(sock===client) this.clients.splice(index, 1)
        })
    }
    checkIfValidPassword(input:string): Promise<string>{
        return new Promise((resolve, reject) => {
            const max = this.clientsPassword.length
            let rows = 0
            this.clientsPassword.forEach(({password, clientName}) => {
                if(input !== password){
                    rows++
                    if(max === rows) reject()
                    return
                }
                resolve(clientName)
            });
        })
    }
    private handleErrors(){
    }
    start(port: number, host: string){
        this.server.listen(port, host)
        return this
    }
}
new NetworkServer()