<?php
namespace HTNProtocol\Packets;

use Exception;
use HTNProtocol\Packets\Exceptions\PacketExeption;

class SentDataPacket
{
    public string $from;
    public function __construct($from, string|array $only) {
        if(is_string($only)) {
            if($from === $only) {
                $this->from = $from;
                return;
            }
            throw new PacketExeption("Cannot Accept Client");
        }
        foreach ($only as $key => $value) {
            if($value === $from) {
                $this->from = $from;
                return;
            }
        }
        throw new PacketExeption("Cannot Accept Client");
    }
    public function getSender()
    {
        return $this->from;
    }
}