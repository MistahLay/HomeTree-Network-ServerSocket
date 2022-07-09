<?php
namespace HTNProtocol\Packets;

class Request extends SendablePacket{
    
    public function __construct(string|array $only, string $from, protected int $id)
    {
    }
}