<?php
// Include your database connection file
include 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data && isset($data['user_id'])) {
        $user_id = $data['user_id'];

        // SQL query to get all events attended by the user
        $sql = "
            SELECT e.event_id
            FROM attendances a
            JOIN events e ON a.event_id = e.event_id
            WHERE a.user_id = ?
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Fetch all events
        $event_ids = [];
        while ($row = $result->fetch_assoc()) {
            $event_ids[] = $row['event_id'];
        }

        // Close the database connections
        $stmt->close();
        $conn->close();

        // Send back the event_ids as a JSON response
        header('Content-Type: application/json');
        echo json_encode($event_ids);
    } else {
        echo "Invalid input.";
    }
}

?>
