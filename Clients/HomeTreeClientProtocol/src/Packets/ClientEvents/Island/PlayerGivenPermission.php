<?php
namespace HTNProtocol\Packets\ClientEvents\Island;

class PlayerGivenPermission extends IslandBase 
{
    public function __construct(string $island, public string $player, public string $permission, public string $member, array|string $sendTo = "all")
    {
        parent::__construct($island, $sendTo);
    }
}