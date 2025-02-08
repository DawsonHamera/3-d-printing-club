<?php
include 'auth.php';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $job_date = date('Y-m-d', strtotime($data['job_date']));
            $job_time = date('H:i:s', strtotime($data['job_time']));
            $printer = $data['printer'];
            $item = $data['item'];
            $link = $data['link'];
            $assigned_to = $data['assigned_to'];
            
            // Check if the job is already scheduled at this time
            $stmt = $conn->prepare("SELECT * FROM print_jobs WHERE job_date = ? AND job_time = ?");
            $stmt->bind_param("ss", $job_date, $job_time);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                echo json_encode(["error" => "Another print job is already scheduled at this time."]);
            } else {
                $stmt = $conn->prepare("INSERT INTO print_jobs (job_date, job_time, printer, item, link, assigned_to) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssss", $job_date, $job_time, $printer, $item, $link, $assigned_to);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Job added successfully."]);
                } else {
                    echo json_encode(["error" => "Failed to add job."]);
                }
            }

            $stmt->close();
        } else {
            echo json_encode(["error" => "Invalid JSON input."]);
        }
    }
}
?>
