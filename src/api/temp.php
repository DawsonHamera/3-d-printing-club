<?php
include 'db.php';
// Get all table names from the database
$sql = "SHOW TABLES";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_array()) {
        $table = $row[0];
        echo "<h3>Contents of table: $table</h3>";
        
        $sql = "SELECT * FROM $table";
        $tableResult = $conn->query($sql);
        
        if ($tableResult->num_rows > 0) {
            while ($tableRow = $tableResult->fetch_assoc()) {
                foreach ($tableRow as $column => $value) {
                    echo "$column: $value <br>";
                }
                echo "<br>";
            }
        } else {
            echo "No records found in table $table<br>";
        }
    }
} else {
    echo "No tables found in the database";
}

$conn->close();
?>
