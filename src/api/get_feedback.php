<?php
include 'db.php';

// Get all feedback from the database
$result = $conn->query("SELECT * FROM feedback ORDER BY created_at DESC");

$feedback = [];
while ($row = $result->fetch_assoc()) {
    $feedback[] = $row;
}

echo json_encode($feedback);
?>
