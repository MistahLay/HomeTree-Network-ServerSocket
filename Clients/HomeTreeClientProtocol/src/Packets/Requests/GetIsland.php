<?php
namespace HTNProtocol\Packets\Requests;

use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;
use HTNProtocol\Packets\ReceivableRequest;

class GetIsland extends ReceivableRequest
{
    public string $islandID;
    public function __construct(string $from, array $data, int $id)
    {
        parent::__construct($from, [PacketFactory::DISCORD_BOT, PacketFactory::REST_API], $id);
        if(!is_string($this->islandID = $data['island'])) throw new PacketExeption("Invalid GetIsland Request");
    }
}