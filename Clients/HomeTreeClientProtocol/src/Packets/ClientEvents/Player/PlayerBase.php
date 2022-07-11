<?php
namespace HTNProtocol\Packets\ClientEvents\Player;

use HTNProtocol\Packets\SendablePacket;
class PlayerBase extends SendablePacket
{
    public string $player;
    public function __construct(string $player, string|array $to) {
        $this->player = $player;
        parent::__construct($to);
    }
}