<?php
namespace HTNProtocol\Packets\ClientEvents\Island;

use HTNProtocol\Packets\SendablePacket;

class IslandBase extends SendablePacket
{
    public function __construct(public string $island, string|array $sendTo)
    {
        parent::__construct($sendTo);
    }
}