<?php

    class Json {

        function encode($arr) {
            $str = "";

            $i = 0;
            $len = count($arr);
            foreach($arr as $key => $value) {
                $is_array = is_array($value);
                $key_is_numeric = is_numeric($key);

                $str .= ($i==0 AND !$key_is_numeric)?"{":($i>0?", ":"");
                $str .= (!$key_is_numeric?"\"$key\": ":"") . ((!$key_is_numeric AND $is_array)?"[":"");

                $str .= $is_array?$this->encode($value):$this->print_value($value);

                $str .= (!$key_is_numeric AND $is_array)?"]":"";
                $str .= ($i==$len-1 AND !$key_is_numeric)?"}":"";

                $i++;
            }

            return $str;
        }

        function print_value($value) {

            if(gettype($value)=="boolean") return $value?"true":"false";
            elseif(!is_numeric($value)) return "\"" . addcslashes($value, "\n\r\"\\") . "\"";

            return $value;
        }
    }