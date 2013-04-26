<?php
    include "../php/mysql.db.php";
    $db = new koneksi();

    include "../php/initial.php";
    $conn = $db->connect();

    $sql = "SELECT id,CONCAT(tahun, ' ', semester) AS keterangan,aktif FROM tahunakademik WHERE 1 " .
           "ORDER BY id";
    $db->query($sql, $rec_num, $rs);
    $db->close($conn);

    $result = array(
        "totalCount" => $rec_num ,
        "topics"    => $rs
    );

    include "../php/Json.php";
    $json = new Json();

    die($json->encode($result));
?>