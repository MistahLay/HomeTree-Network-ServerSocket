<?php
namespace HTNProtocol\Packets\ClientEvents\Island;

class PlayerUpgradedPermission extends IslandBase 
{
    public function __construct(string $island, public string $player, public string $permission, public string $member, string|array $sentTo = 'all')
    {
        parent::__construct($island, $sentTo);
    }
}
