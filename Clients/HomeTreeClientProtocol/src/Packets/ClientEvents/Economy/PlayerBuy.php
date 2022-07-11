<?php
namespace HTNProtocol\Packets\ClientEvents\Economy;

use HTNProtocol\Packets\ClientEvents\PlayerBase;

class PlayerBuy extends PlayerBase {
    public function __construct(string $player, public string $item, public int $amount, string|array $sendTo = 'all') 
    {
        parent::__construct($player, $sendTo);
    }
}