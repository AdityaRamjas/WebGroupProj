<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="images/favicon.ico"/>
    <title>Flappy Bird Game</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap" rel="stylesheet">
</head>
<body>
    <?php
    function displayLeaderboard()
    {
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

        $sql = "SELECT player_name, score, date FROM scores ORDER BY score DESC LIMIT 10";
        if ($result = $conn->query($sql))
        {
            echo "<table border = 1 style=\"text-align: center\"";
            echo "<th colspan = 2 style=\"text-align: center\">Leaderboard</th>";
            echo "<tr><th>User</th><th>Score</th></tr>";

            while ($obj=$result -> fetch_object())
            {
                echo "<tr><td>$obj->player_name</td>";
                echo "<td>$obj->score</td>";
                echo "</tr>";
            }
        }
        
        echo "</table>";
    }
    ?>
    <div class="background">
        <div class = "leaderboard">
    <p><?php displayLeaderboard();?></p>
    </div>
    
    <img src="images/Bird.png" alt="bird-img" class="bird" id="bird-1">
    <div class="message">
        <h1>Welcome To Flappy Bird! <h1></br>Enter To Start Game <p><span style="color: red;"></span> Up Arrow or Space to Fly<p>

    </div>
    <div class="score">
        <span class="score_title"></span>
        <span class="score_val"></span>
    </div>
   
    </div>

</body>
</html>