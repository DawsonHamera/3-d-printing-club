<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT  user_id, username, email, first_name, last_name, role, grade, score, created_at FROM users");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    echo json_encode($events);

    $stmt->close();
} else {
    echo json_encode(["message" => "Invalid request method."]);
}
?>
