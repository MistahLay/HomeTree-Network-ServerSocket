<?php
namespace HTNProtocol\Packets\Requests;

use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;
use HTNProtocol\Packets\SentDataPacket;

class PlayerWarn extends SentDataPacket
{
    public string $player;
    public string $reason;
    public string $staff;
    public function __construct(string $from, array $data)
    {
        parent::__construct($from, PacketFactory::DISCORD_BOT);
        if(!(is_string($data['player']) && is_string($data['reason']) && is_string($data['staff']))) throw new PacketExeption("Invalid PlayerBan Request Object");
        $this->player = $data['player'];
        $this->reason = $data['reason'];
        $this->staff = $data['staff'];   
    }
}