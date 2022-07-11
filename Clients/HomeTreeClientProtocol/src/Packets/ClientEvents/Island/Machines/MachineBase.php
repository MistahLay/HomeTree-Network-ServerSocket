<?php
namespace HTNProtocol\Packets\ClientEvents\Island\Machines;

use HTNProtocol\Packets\ClientEvents\Island\IslandBase;
use HTNProtocol\Packets\ClientEvents\Island\Machines\Coordinates;
class MachineBase extends IslandBase
{
    public string|null $type = null;
    public function __construct(string $island, public Coordinates $coordinates, string|array $sendTo = 'all')
    {
        parent::__construct($island, $sendTo);
    }
}   