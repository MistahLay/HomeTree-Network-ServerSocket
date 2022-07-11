<?php
namespace HTNProtocol\Packets\API\Requests;

use HTNProtocol\Packets\API\ReceivableRequest;
use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;
use HTNProtocol\Packets\SentDataPacket;

class GivePlayerMoney extends ReceivableRequest{
    public string $staff;
    public string $player;
    public int $amount;
    public function __construct(string $from, array $data, string $id) {
        parent::__construct($from, PacketFactory::DISCORD_BOT, $id);
        if(!(is_string($data['player']) && is_string($data['staff']) && is_int($data['amount']))) throw new PacketExeption("Invalid GivePlayerMoney Request");
        $this->staff = $data['staff'];
        $this->player = $data['player'];
        $this->amount = $data['amount'];
    }
}