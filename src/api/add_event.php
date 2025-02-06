<?php
include 'db.php';
$auth_level = 'admin';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $event_name = $data['event_name'];
            $event_type = $data['event_type'];
            $event_details = $data['event_details'];
            $event_location = $data['event_location'];
            $scheduled_by = $data['scheduled_by'];
            $verification_code = $data['verification_code'];
            $event_date = date('Y-m-d', strtotime($data['event_date']));
            $start_time =  date('H:i:s', strtotime($data['start_time']));
            $end_time = date('H:i:s', strtotime($data['end_time']));

            //Add new values soon!
            
            // Check if verification code is unique
            $stmt = $conn->prepare("SELECT * FROM events WHERE verification_code = ?");
            $stmt->bind_param("s", $verification_code);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(["error" => "Verification code must be unique."]);
            } else {
                $stmt = $conn->prepare("INSERT INTO events (event_name, event_type, event_details, event_location, scheduled_by, verification_code, event_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("sssssssss", $event_name, $event_type, $event_details, $event_location, $scheduled_by, $verification_code, $event_date, $start_time, $end_time);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Event added successfully."]);
                } else {
                    echo json_encode(["message" => "Failed to add event."]);
                }
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
}
?>
