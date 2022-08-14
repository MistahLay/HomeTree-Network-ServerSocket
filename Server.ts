import net from "net";
import { ArrayModel, ObjectModel } from "objectmodel";
import { EventEmitter } from "events";
import WebSocket, { WebSocketServer } from "ws";
type NetworkServerEvents =
    | "client_login"
    | "client_leave"
    | "start"
    | "shutdown"
    | "crash"
    | "client_send_data";
type NetworkServerEvent<T extends NetworkServerEvents> = T extends "shutdown"
    ? null
    : T extends "crash"
    ? string
    : T extends "start"
    ? null
    : T extends "client_login"
    ? number
    : T extends "client_send_data"
    ? number
    : never;
interface NetworkServer {
    on<T extends NetworkServerEvents>(
        eventType: T,
        event: (event: NetworkServerEvent<T>) => void
    ): this;
}
interface SentJson {
    data: object;
    data_type: string;
    api?: "request" | "response";
    id?: string;
    success?: string | true;
    to: string | string[];
}
const Model = new ObjectModel({
    data_type: String,
    data: Object,
    to: [String, new ArrayModel(String)],
});
const ApiModel = new ObjectModel({
    data_type: String,
    data: Object,
    api: ["request", "response"],
    id: String,
    to: [String, new ArrayModel(String)],
});
const ErrorResponseModel = new ObjectModel({
    data_type: "error",
    data: String,
    api: "response",
    id: String,
    to: [String, new ArrayModel(String)],
});
const SuccessDataModel = new ObjectModel({
    data_type: "success",
    data: [undefined, null],
    api: "response",
    id: String,
    to: [String, new ArrayModel(String)],
});
class NetworkServer extends EventEmitter {
    public server: WebSocketServer;
    clientsIdentification: { [key: string]: string } = {};
    clients: { [key: string]: WebSocket } = {};
    constructor() {
        super();
        this.server = new WebSocketServer({ port: 8080, host: "localhost" });
        this.registerClients();
        this.listenClientsConnection();
    }
    private async registerClients() {
        this.clientsIdentification = require("./clients.json");
    }
    private listenClientsConnection() {
        this.server.on("connection", (client) => {
            console.log("Client connecting...");
            client.once("message", async (data) => {
                try {
                    const json = JSON.parse(data.toString());
                    if (
                        !(
                            this.clientsIdentification[json.name] ===
                            json.password
                        )
                    ) {
                        console.log(this.clientsIdentification);
                        return client.close();
                    }
                    if (this.clients[json.name]) return client.close();

                    this.clients[json.name] = client;
                    this.sendSentData(
                        {
                            data: {
                                clients: Object.keys(this.clients),
                            },
                            data_type: "Clients",
                            to: json.name,
                        },
                        "Server"
                    );
                    this.sendSentData(
                        {
                            data: {
                                client: json.name,
                            },
                            data_type: "ClientJoin",
                            to: "all",
                        },
                        "Server"
                    );
                    client.once("error", () => {});
                    client.once("close", () => {
                        this.removeClient(client);
                        this.sendSentData(
                            {
                                data: {
                                    client: json.name,
                                },
                                data_type: "ClientClose",
                                to: "all",
                            },
                            "Server"
                        );
                        client.removeAllListeners();
                        console.log("Closed Connection");
                    });
                    this.listenSentData(client, json.name);
                    console.log("Client Connected");
                    return true;
                } catch (error) {
                    client.close();
                }
            });
        });
    }
    removeClient(client: WebSocket) {
        const key = Object.keys(this.clients).find(
            (key) => this.clients[key] === client
        );
        if (key) delete this.clients[key];
    }
    private listenSentData(client: WebSocket, name: string) {
        client.on("data", (data) => {
            try {
                const json: SentJson = JSON.parse(data.toString());
                if (json.api) {
                    if (!(json.api === "request" || json.api === "response"))
                        return client.close();
                    if (json.data_type === "error")
                        return json.api === "response"
                            ? this.sendSentData(
                                  new ErrorResponseModel(json) as SentJson,
                                  name
                              )
                            : client.close();
                    if (json.data_type === "success")
                        return this.sendSentData(
                            new SuccessDataModel(json) as SentJson,
                            name
                        );
                    return this.sendSentData(
                        new ApiModel(json) as SentJson,
                        name
                    );
                }
                if (json.data_type === "success") return client.close();
                new Model(json);
                console.log(json);
                this.sendSentData(json, name);
            } catch (error) {
                console.error(error);
                client.close();
            }
        });
    }
    sendSentData(data: SentJson, from: string) {
        if (data.to === "all") {
            for (const key in this.clients) {
                try {
                    this.clients[key].send(
                        JSON.stringify({
                            data: data.data,
                            from,
                            data_type: data.data_type,
                            api: data.api,
                            id: data.id,
                        })
                    );
                } catch (error) {
                    continue;
                }
            }
            return;
        }
        if (Array.isArray(data.to)) {
            for (let i = 0; i < data.to.length; i++) {
                if (!this.clients[data.to[i]]) continue;
                this.clients[data.to[i]].send(
                    JSON.stringify({
                        data: data.data,
                        from,
                        data_type: data.data_type,
                        api: data.api,
                        success: data.success,
                        id: data.id,
                    })
                );
            }
            return;
        }
        this.clients[data.to].send(
            JSON.stringify({
                data: data.data,
                from,
                data_type: data.data_type,
                api: data.api,
                success: data.success,
                id: data.id,
            })
        );
    }
}
new NetworkServer();
