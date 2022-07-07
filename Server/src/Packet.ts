type Packet_Types = "request"|"client_event"|"response"
export interface Packet{
    packet_type:Packet_Types
    sendTo:string[]
    packet:any
}
interface RequestPacket{
    request_type:string
    id:string
    request:{}
}
interface ResponsePacket{
    response_type:string
    id:string
    response:{}
}
interface ClientEventPacket{
    event_type:string
    event:{}
}
interface SendTo{
    client:string
    responseId:string
}
export function Verify(pk:Packet):boolean{
    if(typeof pk.packet_type === "string" && typeof pk.sendTo === "object" && typeof pk.packet === "object"){
        switch (pk.packet_type) {
            case "request":
                return verifyRequestPacket(pk.packet)
            case "client_event":
                return verifyClientEventPacket(pk.packet)
            case "response":
                return verifyResponsePacket(pk.packet)
            default:
                return false;
        }
    }
    return false
}
function verifyRequestPacket(pk:any){
    return (typeof pk.id === "string" && typeof pk.request_type === "string" && typeof pk.request === "object")
}
function verifyClientEventPacket(pk:any){
    return (typeof pk.event === "object" && typeof pk.event_type === "string")
}
function verifyResponsePacket(pk:any){
    return (typeof pk.id === "string" && typeof pk.response_type === "string" && typeof pk.response === "object")
}
try {
console.log(JSON.parse('fefe'))
    
} catch (error) {

}