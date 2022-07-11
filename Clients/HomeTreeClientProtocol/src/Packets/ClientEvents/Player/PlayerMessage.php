<?php
namespace HTNProtocol\Packets\ClientEvents\Player;

use HTNProtocol\Packets\ClientEvents\Player\PlayerBase;

class PlayerMessage extends PlayerBase
{
    public function __construct(array|string $to, public string $player, public string $message)
    {
        parent::__construct($player, $to);
    }
    public function getSending()
    {
        return $this->to;
    }
}