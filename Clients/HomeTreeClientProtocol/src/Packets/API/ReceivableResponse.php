<?php
namespace HTNProtocol\Packets\API;
use HTNProtocol\Packets\SentDataPacket;

class ReceivableResponse extends SentDataPacket {
    public function __construct(string $from, string|array $only, protected bool $success, protected string $id) {
        parent::__construct($from, $only);
    }
    public function getId(){
        return $this->id;
    }
    public function isSuccess(){
        return $this->success;
    }
}