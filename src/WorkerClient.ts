import ws from "ws";
import { parentPort, workerData } from "worker_threads";
import { ClientEvent, Clients, Data } from "./Server";
type data = { data: any; data_type: string; from: string };
if (!parentPort) throw new Error("Parent Port doesnt exist");
if (!(workerData.client instanceof ws.WebSocket))
    throw new Error("Data give isn't a client");
let clients: Clients = workerData.clients;
const client: ws.WebSocket = workerData.client;
parentPort.on("message", (data: ClientEvent) => {
    if (data.client)
        if (data.type === "client_joined") {
            clients[data.client_name] = data.client;
            return;
        }
    if (data.type === "client_left") {
        delete clients[data.client_name];
    }
});
client.on("close", () => {
    const event: ClientEvent = {
        client_name: workerData.name,
        client,
        type: "client_left",
    };
    parentPort?.postMessage(event);
});
client.on("message", (data) => {
    try {
        const json: Data = JSON.parse(data.toString());
        if (!json.data) return closeClient(101, "Data is empty");
        if (!(typeof json.data_type === "string"))
            return closeClient(102, "Data Type should only be a string");
        if (json.api) {
            if (!json.id)
                return closeClient(
                    103,
                    "Data can't have an api if id doesn't exists"
                );
            if (json.to === "Server" && json.api === "request")
                return serverRequest(
                    json as Data & { id: string; api: "request" }
                );
        }
        if (!json.to) return closeClient(104, "To property is empty");
        if (typeof json.to === "string")
            if (!clients[json.to])
                return closeClient(105, "Client doesnt exist");
    } catch (error) {
        if (error instanceof SyntaxError)
            return closeClient(106, "Invalid Json");
    }
});
function closeClient(code: number, data: string) {
    client.close(code, data);
    const event: ClientEvent = {
        client_name: workerData.name,
        client,
        type: "client_left",
    };
    parentPort?.postMessage(event);
}
function serverRequest(json: Data & { id: string; api: "request" }) {
    switch (json.data_type) {
        case "is_online":
            break;
        default:
            break;
    }
}
function sendData(
    data: data,
    to: string,
    api?: { id: string; api: "request" }
) {
    clients[to].send(Object.assign(data, api));
}
