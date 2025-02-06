<?php
// include 'auth.php';
include 'db.php';
$auth_level = 'admin';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $event_id = $data['event_id'];
            // Proceed to delete the event
            $stmt = $conn->prepare("DELETE FROM events WHERE event_id=?");
            $stmt->bind_param("s", $event_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Event deleted successfully."]);
            } else {
                echo json_encode(["message" => "Failed to delete event."]);
            }
          
        
            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
}
?>
