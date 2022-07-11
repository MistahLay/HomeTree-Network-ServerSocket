<?php
namespace HTNProtocol\Packets\API\Requests;

use HTNProtocol\Packets\Exceptions\PacketExeption;

class TempbanTime {
    public int $days;
    public int $hours;
    public int $minutes;
    public function __construct(array $time)
    {
        if(!(is_int($time['days'] && !($time['hours'] <= 60) && !($time['minutes'] <= 60)))) throw new PacketExeption("Invalid Time For TempBan");
        $this->days = $time['days'];
        $this->hours = $time['hours'];
        $this->minutes = $time['minutes'];
    }
}