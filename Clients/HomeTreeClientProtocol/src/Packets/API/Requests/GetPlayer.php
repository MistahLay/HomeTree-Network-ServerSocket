<?php
namespace HTNProtocol\Packets\API\Requests;

use HTNProtocol\Packets\API\ReceivableRequest;
use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;

class GetPlayer extends ReceivableRequest
{
    public string $player;
    public function __construct(string $from, array $data, string $id)
    {
        parent::__construct($from, [PacketFactory::DISCORD_BOT, PacketFactory::REST_API], $id);
        if(!is_string($this->player = $data['player'])) throw new PacketExeption("Invalid GetPlayer Request");
    }
}