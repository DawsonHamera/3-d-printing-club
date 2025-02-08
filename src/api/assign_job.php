<?php
// include 'auth.php';
include 'auth.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $job_id = $data['job_id'];
            $username = $data['username'];

            // Proceed to assign the job
            $stmt = $conn->prepare("UPDATE print_jobs SET assigned_to=? WHERE job_id=?");
            $stmt->bind_param("ss", $username, $job_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Job assigned successfully."]);
            } else {
                echo json_encode(["message" => "Failed to assign job."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
?>
