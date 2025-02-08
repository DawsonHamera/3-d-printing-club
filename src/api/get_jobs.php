<?php
include 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // SQL query to fetch print jobs from your database
    $stmt = $conn->prepare("SELECT job_id, job_date, job_time, printer, item, link, assigned_to FROM print_jobs");
    $stmt->execute();
    $result = $stmt->get_result();

    $jobs = [];
    
    // Fetching all the print jobs
    while ($row = $result->fetch_assoc()) {
        $jobs[] = $row;
    }

    // Output the jobs data as JSON
    echo json_encode($jobs);

    // Close the statement
    $stmt->close();
} else {
    // If request method is not GET, return an error message
    echo json_encode(["message" => "Invalid request method."]);
}
?>
