<?php
namespace HTNProtocol\Packets;

class ReceivableRequest extends SentDataPacket
{
    public function __construct(string $from, string|array $only, protected int $id)
    {
        parent::__construct($from, $only);
    }
}