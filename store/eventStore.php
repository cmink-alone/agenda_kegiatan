<?php

    include "../php/mysql.db.php";
    $db = new koneksi();

    include "../php/initial.php";
    $conn = $db->connect();

    $sql = "SELECT id,warna AS cid, kegiatan AS title,tgl_dari AS `start`, tgl_sampai AS `end`, TRUE AS `ad` FROM tbl_kalender_akademik ORDER BY tgl_dari";
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