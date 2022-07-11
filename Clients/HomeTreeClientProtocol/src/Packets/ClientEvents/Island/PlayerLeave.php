<?php
namespace HTNProtocol\Packets\ClientEvents\Island;

class PlayerLeave extends IslandBase {
    public function __construct(string $island, public string $player, string|array $sentTo = 'all')
    {
        parent::__construct($island, $sentTo);
    }
}