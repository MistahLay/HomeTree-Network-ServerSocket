<?php
namespace HTNProtocol\Packets\ClientEvents\Economy;

use HTNProtocol\Packets\ClientEvents\PlayerBase;

class PlayerPay extends PlayerBase {
    public function __construct(string $player, public string $amount, string|array $sendTo = 'all')
    {
        parent::__construct($player, $sendTo);
    }
}