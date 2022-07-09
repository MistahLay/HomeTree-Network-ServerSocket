<?php
namespace HTNProtocol;

use HTNProtocol\Packets\SendablePacket;
use pocketmine\thread\Thread;
use Socket;

class ClientSocket extends Thread
{
    private Socket $sock;
    private bool $isOn = false;
    public function __construct(private String $host, private Int $port, private String $password, private String $clientName) {
        $this->sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        $this->start();
    }
    public function onRun():void {
        if(socket_connect($this->sock, $this->host, $this->port)) $this->reconnect();;
        while (true) {
            try {
                $data = socket_read($this->sock, 1024, 0);
                if($data) {
                    $this->reconnect();
                    continue;
                }
                $packet = json_decode($data, true);
                if(!$packet) continue;
                /**
                 * Received packets will be verify by the Packet Factory
                 * If the value of 'from' somehow doesnt exist or a valid client name then it will be ignored
                 * If everything else is a invalid except for 'from' then the PacketFactory will throw a InvalidPacketFormatException then it will be catched by the trycatch
                 * If packet object doesnt match packet_type then it will throw an error
                 * 
                 */

            } catch (\Throwable $th) {
                var_dump($th);
                continue;
            }
        }
    }
    private function reconnect():void
    {
        $this->isOn = false;
        $this->sock = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
        while (!$this->isOn) {
            if(socket_connect($this->sock, $this->host, $this->port)) return $this->isOn = true;
        }
    }
    public function sendPacket(SendablePacket $packet)
    {
        
    }
}