<?php
// Include your database connection file
require 'db.php';
$auth_level = 'admin';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the POST request data
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $user_id = $data['user_id'];
            $verification_code = $data['verification_code'];

            // Check if the verification code exists in the events table
            $stmt = $conn->prepare("SELECT event_id, event_name FROM events WHERE verification_code = ?");
            $stmt->bind_param("s", $verification_code);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Fetch the event_id and event_name
                $row = $result->fetch_assoc();
                $event_id = $row['event_id'];
                $event_name = $row['event_name'];

                // Check if the verification code is already used by the user
                $stmt_check = $conn->prepare("SELECT attendance_id FROM attendances WHERE user_id = ? AND event_id = ?");
                $stmt_check->bind_param("ii", $user_id, $event_id);
                $stmt_check->execute();
                $result_check = $stmt_check->get_result();

                if ($result_check->num_rows > 0) {
                    echo json_encode(["error" => "Duplicate verification code. You have already attended this event."]);
                } else {
                    // Insert the record into the attendances table
                    $sql_insert = "INSERT INTO attendances (user_id, event_id, verified_at) VALUES (?, ?, NOW())";
                    $stmt_insert = $conn->prepare($sql_insert);
                    $stmt_insert->bind_param("ii", $user_id, $event_id);

                    if ($stmt_insert->execute()) {
                        echo json_encode(["message" => "Attendance record added successfully.", "event_name" => $event_name]);
                    } else {
                        echo json_encode(["error" => "Error: " . $stmt_insert->error]);
                    }
                    $stmt_insert->close();
                }
                $stmt_check->close();
            } else {
                echo json_encode(["error" => "Invalid verification code."]);
            }

            // Close the database connections
            $stmt->close();
            $conn->close();
        }
    }
}
?>
