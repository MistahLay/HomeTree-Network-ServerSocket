<?php
namespace HTNProtocol\Packets;

use Exception;
use HTNProtocol\Packets\Exceptions\PacketExeption;

class PacketFactory {
    const DISCORD_BOT = 'DiscordBot';
    const REST_API = 'RestAPI';
    public static function create(string $type, string $from, array $data){
        if(!($from === self::DISCORD_BOT || $from === self::REST_API)) throw new Exception();
        switch ($type) {
            case 'request':
                $req_type = $data['request_type'];
                $namespace = "\HTNProtocol\Packets\Requests\\$req_type";
                try {
                    echo $namespace;
                    var_dump(class_parents(new \HTNProtocol\Packets\Requests\PlayerBan("E", ["staff"=>"LayWasTaken#6969", "player"=>"Vardaesia", "reason" => "bad"])));
                } catch (\Throwable $th) {
                    echo $th->getMessage();
                }
                return;
            case 'response':
                return;
            case 'client_event':
                return;
            default:
                # code...
                break;
        }
    }
}
PacketFactory::create('request', PacketFactory::DISCORD_BOT, ["request_type"=>"PlayerBan"]);