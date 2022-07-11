<?php
namespace HTNProtocol\Packets\API;

use HTNProtocol\Packets\SendablePacket;
class SendableResponse extends SendablePacket {
    public function __construct(array|string $to, protected bool $success, protected $id, array $response)
    {
        parent::__construct($to);
    }
    public function getId()
    {
        return $this->id;
    }
    public function isSuccess()
    {
        return $this->success;
    }
}