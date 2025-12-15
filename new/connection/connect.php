<?php

$servername = "localhost"; 
$username = "root";        
$password = "";            
$dbname = "cs_go";         

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Błąd połączenia z bazą danych: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>