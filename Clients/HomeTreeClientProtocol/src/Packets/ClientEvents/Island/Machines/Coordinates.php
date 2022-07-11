<?php
namespace HTNProtocol\Packets\ClientEvents\Island\Machines;
class Coordinates {
    public function __construct(public int $x = 0, public int $y = 0, public int $z = 0){}
}