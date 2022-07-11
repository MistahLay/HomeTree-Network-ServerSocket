<?php
namespace HTNProtocol\Packets\API;
use HTNProtocol\Packets\SendablePacket;

class SendableRequest extends SendablePacket{
    protected string $id;

    public function __construct(string|array $to)
    {
        parent::__construct($to);
        $this->id = mt_rand();
    }
    public function getId()
    {
        return $this->id;
    }
}