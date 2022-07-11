<?php
namespace HTNProtocol\Packets\API\Requests;

use HTNProtocol\Packets\API\ReceivableRequest;
use HTNProtocol\Packets\Exceptions\PacketExeption;
use HTNProtocol\Packets\PacketFactory;
use HTNProtocol\Packets\API\Requests\TempbanTime;

class PlayerTempBan extends ReceivableRequest {
    public string $player;
    public string $reason;
    public string $staff;
    public TempbanTime $time;
    public function __construct(string $from, array $data, string $id) {
        parent::__construct($from, PacketFactory::DISCORD_BOT, $id);
        if(!(is_string($data['player']) && is_string($data['reason']) && is_string($data['staff']) && is_array($data['time']))) throw new PacketExeption("Invalid PlayerBan Request Object");
        $this->time = new TempbanTime($data['time']);
        $this->player = $data['player'];
        $this->reason = $data['reason'];
        $this->staff = $data['staff'];
    }

}