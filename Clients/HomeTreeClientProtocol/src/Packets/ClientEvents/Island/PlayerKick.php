<?php
namespace HTNProtocol\Packets\ClientEvents\Island;

class PlayerKick extends IslandBase {
    public function __construct(public string $island, public string $player, public string $reason, public string $member, string|array $sendTo = 'all')
    {
        parent::__construct($island, $sendTo);
    }
}