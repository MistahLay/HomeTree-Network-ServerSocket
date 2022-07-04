# HomeTree-Network-Protocol

A network protocol for the HomeTreePE Server

## How it works
### **Connections**
The clients will connect to the server then they **must** send a password to connect if the password is wrong the server will kick the client and it should shut down

The server can only have specific clients based on the password and it will not accept other clients if the sent password is already been used

The server will give a name based on the password that the client sent
#### Example Server
```
Client connecting...
Client password is valid!
**************************************************
Client has been accepted as Pocketmine Server
Client connecting...
Client password was trying to use "Pocketmine Server" password but its currently being use by another client.
Client has been kicked.
**************************************************
Client connecting...
Client sent invalid password.
Client has been kicked.
```

If the server is offline the clients will try to reconnect.

### **Packet Sending**

Sent packets must follow this JSON format if not it will be ignored.

```json
{
    "packet_type":"packet_types",
    "packet": {}
}
```

The **packet** object must be based on the ***packet_types***

All the Packet Types are the following with it's **Packet Objects**.

#### **Request**

Everything must not be empty

**id** must be int/number if not it will be ignored.

**request_type** must be a valid request type based on the logined client if not it will send a error as a response.

**request** must be based on the request_type if not it will send a error as a response
JSON format
```json
{
    "id": 10101010101010,
    "request_type": "Request Types",
    "request":{}
}
```

#### **Response**
**id** and **success** must be followed and not empty or it will be ignored.

**ID** must be int/number.

**Success** must be bool.

**Response** if **success** property is true then it could have a response object or none, if false however it should have a response error which is a string.

**note**: If the **response** isnt based on the request then the client that requested it will ignore it.

JSON format
```json
{
    "id": 101010,
    "success": true,
    "response": "{}|string"
}
```
#### **Client Events**
Everything must be followed and not empty or it will be ignored.

**event_type** must be a valid based on the logined client.

**event** must be based on the event_type.

JSON Format
```json
{
    "event_type": "Event types",
    "event": {}
}
```
