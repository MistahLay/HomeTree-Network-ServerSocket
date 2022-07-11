<?php
namespace HTNProtocol\Packets;

class SendablePacket {
    const DISCORD_BOT = 'DiscordBot';
    const REST_API = 'RestAPI';
    protected array|string $to;
    public function __construct(string|array $to)
    {
        $this->to = $to;
    }
    public function getSendTo()
    {
        return $this->to;
    }
}