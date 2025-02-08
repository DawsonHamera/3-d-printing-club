<?php
include 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT event_name, event_id, event_type, event_details, event_location, scheduled_by, verification_code, event_date, start_time, end_time FROM events");
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
