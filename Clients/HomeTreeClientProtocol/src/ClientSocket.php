<?php
namespace HTNProtocol;

use HTNProtocol\Packets\API\Requests\PlayerBan;
use HTNProtocol\Packets\API\SendableRequest;
use HTNProtocol\Packets\API\SendableResponse;
use HTNProtocol\Packets\ClientEvents\Player\PlayerDies;
use HTNProtocol\Packets\SendablePacket;
use pocketmine\thread\Thread;
use ReflectionClass;
use Socket;

class ClientSocket extends Thread
{
    private Socket $sock;
    private bool $isOn = false;
    const PACKET_TEMPLATE = ["packet_type" => "", "packet"=>[]];
    public function __construct(private String $host, private Int $port, private String $password, private String $clientName) {
        $this->sock = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        $this->start();
    }
    public function onRun():void {
        try {
            if(@socket_connect($this->sock, $this->host, $this->port)) {
                $A = json_encode(["name"=>$this->clientName, "password"=>$this->password]);
                echo @socket_read($this->sock, 1024, 0);
                @socket_write($this->sock, $A, 1024);
                echo @socket_read($this->sock, 1024, 0);
                $this->isOn = true;
            }else{
                $this->reconnect();
            }
        } catch (\Throwable $th) {
            $this->reconnect();
        }
        while (true) {
            try {
                $data = @socket_read($this->sock, 1024, MSG_WAITALL);
                if($data===false) $this->reconnect();
                $pk = json_decode($data, true);
                var_dump($pk);
                var_dump(new PlayerBan($pk['from'], $pk['packet']['request'], $pk['packet']['id']));
            } catch (\Throwable $th) {
                echo $th;
                continue;
            }
        }
    }
    private function reconnect()
    {
        $this->isOn = false;
        unset($this->sock);
        echo "E";
        $this->sock = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        while (!$this->isOn) {
            try {
                echo "E";
                if(socket_connect($this->sock, $this->host, $this->port)){
                    $A = json_encode(["name"=>$this->clientName, "password"=>$this->password]);
                    @socket_read($this->sock, 1024, 0);
                    @socket_write($this->sock, $A, 1024);
                    @socket_read($this->sock, 1024, 0);
                    $this->isOn = true;
                    break;
                }
            } catch (\Throwable $th) {
                continue;
            }
        }
    }
    public function sendPacket(SendablePacket $packet)
    {
        if(!$this->isOn) return;
        echo "E";
        $pk = self::PACKET_TEMPLATE;
        try {
            if($packet instanceof SendableResponse){
                $pk['packet_type'] = "response";
                $pk['to'] = $packet->getSendTo();
                $pk['packet'] = ["id"=>$packet->getId(), "success"=>$packet->isSuccess()];
                if($response = get_object_vars($packet)) $pk['packet']['response'] = $response;
                $jsonData = json_encode($pk);
                return @socket_send($this->sock, $jsonData, strlen($jsonData), 0);
            }
            if($packet instanceof SendableRequest){
                $pk['packet_type'] = "request";
                $pk['to'] = $packet->getSendTo();
                $pk['packet'] = [
                    "id"=>$packet->getId(), 
                    "request_type"=>str_replace("HTNProtocol\Packets\API\Requests\\", "", $packet::class), 
                    "request"=>get_object_vars($packet)
                ];
                $jsonData = json_encode($pk);
                return @socket_send($this->sock, $jsonData, strlen($jsonData), 0);
            }
            $pk['packet_type'] = 'client_event';
            $pk['packet'] = [
                "event_type" => str_replace("HTNProtocol\Packets\ClientEvents\\", "", $packet::class),
                "event" => get_object_vars($packet)
            ];
            $jsonData = json_encode($pk);
            return @socket_send($this->sock, $jsonData, strlen($jsonData), 0);
        } catch (\Throwable $th) {
            echo $th->getMessage();
            return false;
        }
    }
}