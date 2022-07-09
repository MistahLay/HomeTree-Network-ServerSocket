<?php
namespace HTNProtocol\Events;

use pocketmine\event\Event;

class PacketReceiveEvent extends Event
{
    public function __construct(private $packet, private String $from) {}
    public function getPacketData()
    {
        return $this->packet;
    }
    public function getSender():string
    {
        return $this->from;
    }
}
