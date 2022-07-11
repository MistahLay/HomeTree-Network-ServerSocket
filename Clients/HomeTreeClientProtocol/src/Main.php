<?php
namespace HTNProtocol;

use pocketmine\plugin\PluginBase;

class Main extends PluginBase
{
    public function onEnable():void
    {
        new ClientSocket("localhost", 8080, "1234567890", "InGameServer1");
    }
}
