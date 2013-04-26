<?php
    session_start();

    class koneksi{

        var $db_host;
        var $db_user;
        var $db_pass;
        var $field;
        var $db_name;

        public $tabelDB ;
        public $fieldArr ;

        public function koneksi($db_hostparam="",$db_uidparam="",$db_pwdparam="",$db_nameparam="") {
            $this->db_host = $db_hostparam;
            $this->db_user = $db_uidparam;
            $this->db_pass = $db_pwdparam;
            $this->db_name = $db_nameparam;
        }

        public function connect() {
            $this->conn = @mysql_connect($this->db_host, $this->db_user, $this->db_pass, true);
            if($this->conn)
                if(@mysql_select_db($this->db_name, $this->conn))
                    return $this->conn;

            die('Error Connection: ' . mysql_error());
        }

        public function close($conn) {
            $return = @mysql_close($conn);
            unset($conn);
            return $return;
        }

        public function query($sql, &$rec_count, &$data){
            $result = @mysql_query($sql);

            if ($result ) {
                $rec_count = @mysql_num_rows($result);
                $data = array();

                if ($rec_count > 0)
                    while ($row = @mysql_fetch_array($result, MYSQL_ASSOC))
                        array_push($data, $row);

                @mysql_free_result($result);
                unset($result);

                return true;
            }

            die('Invalid SQL command : ' . $sql . '<br><br>' . mysql_error());
        }

         public function execute($conn, $sql) {
            $result = @mysql_query($sql, $conn);

            if($result == 0) {
                if(strpos(mysql_error(), "command denied to user") !== false)
                    die('{success:false, message:"Data dalam keadaan arsip!"}');
                die('Invalid SQL command : ' . $sql . '<br><br>' . mysql_error());
            }else
                return mysql_affected_rows();
        }

        public function SQLupdateData($dataArr,$cozArr, $escapequote=array()) {

            $query = "UPDATE ".$this->tabelDB." SET " ;
            foreach($dataArr as $item => $value )
                $query .= "".$item."=" . (in_array($item, $escapequote)?"$value":"'$value'") . ", ";

            $query = rtrim($query,', ') ;
            $query .= " WHERE ";

            for($i=0;$i< count($cozArr) ;$i++)
                $query .= "".$cozArr[$i]['fieldTbl']."='".$cozArr[$i]['content']."' ".$cozArr[$i]['operator']." ";

            return $query ;
        }

        public function SQLinsertData($escapequote=array()) {
            $query = "INSERT INTO ".$this->tabelDB." SET ";
            $fieldArr = $this->fieldArr ;
            foreach($fieldArr as $item => $value )
                $query .= "".$item."=" . (in_array($item, $escapequote)?"$value":"'$value'") . ", " ;

            $query = rtrim($query,', ') ;
            return $query ;
        }
    }

?>