<?php
namespace HTNProtocol\Packets\API;
use HTNProtocol\Packets\SentDataPacket;
class ReceivableRequest extends SentDataPacket
{
    public function __construct(string $from, string|array $only, protected int $id)
    {
        parent::__construct($from, $only);
    }
    public function getId()
    {
        return $this->id;
    }
}