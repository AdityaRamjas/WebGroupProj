<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flappy_bird";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$player_name = $_POST['player_name'];
$score = $_POST['score'];

$sql = "INSERT INTO scores (player_name, score) VALUES ('$player_name', '$score')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
