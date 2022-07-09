<?php
namespace HTNProtocol\Packets\Requests;

use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;
use HTNProtocol\Packets\SentDataPacket;

class GetPlayer extends SentDataPacket
{
    public string $player;
    public function __construct($from, $data)
    {
        parent::__construct($from, [PacketFactory::DISCORD_BOT, PacketFactory::REST_API]);
        if(!is_string($this->player = $data['player'])) throw new PacketExeption("Invalid GetPlayer Request");
    }
}