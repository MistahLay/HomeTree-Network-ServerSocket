import ws from "ws";
import dotenv from "dotenv";
import { Worker } from "worker_threads";
dotenv.config({ path: __dirname + "/.env" });
export interface Data {
    data: any;
    data_type: string;
    to: string | string[];
    api?: "response" | "request";
    id?: string;
}
export interface ClientEvent {
    type: "client_left" | "client_joined";
    client?: ws.WebSocket;
    client_name: string;
}
export interface Clients {
    [key: string]: ws.WebSocket;
}
class Server {
    websocket: ws.Server;
    clients: Clients = {};
    client_tokens: { [key: string]: string } = {};

    constructor() {
        if (!process.env.PORT) throw new Error("Port must be added");
        if (!process.env.HOST) throw new Error("Host must be added");
        this.websocket = new ws.Server({
            host: process.env.HOST,
            port: parseInt(process.env.PORT),
        });
    }

    listenClients() {
        this.websocket.on("connection", (client) => {
            client.once("message", (data) => {
                try {
                    const json = JSON.parse(data.toString());
                    if (!(this.client_tokens[json.name] === json.password)) {
                        return client.close(99, "Invalid name or token");
                    }
                    if (this.client_tokens[json.name])
                        return client.close(98, "A client is already using it");
                    const client_thread = new Worker(
                        __dirname + "/RunWorker.js",
                        {
                            workerData: {
                                client_name: json.name,
                                client,
                                clients: this.clients,
                            },
                        }
                    );
                    client_thread.once("message", (data: ClientEvent) => {});
                    this.clients[json.name] = client;
                } catch (error) {
                    client.close(100, "Data isn't valid json");
                }
            });
        });
    }

    sendToAll(data: any, data_type: string) {
        for (const key in this.clients) {
            this.clients[key].send({
                data,
                data_type,
                from: "Server",
            });
        }
    }
}
