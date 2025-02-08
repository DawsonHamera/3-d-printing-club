<?php
// include 'auth.php';
include 'auth.php';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $job_id = $data['job_id'];
            // Proceed to delete the event
            $stmt = $conn->prepare("DELETE FROM print_jobs WHERE job_id=?");
            $stmt->bind_param("s", $job_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Job deleted successfully."]);
            } else {
                echo json_encode(["message" => "Failed to delete job."]);
            }
          
        
            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
}
?>
