<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data) {
        $username = $data['username'];
        $email = $data['email'];
        $comment = $data['comment'];

        // Insert the feedback into the database
        $stmt = $conn->prepare("INSERT INTO feedback (username, email, comment) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $comment);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Feedback submitted successfully."]);
        } else {
            echo json_encode(["message" => "Failed to submit feedback."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["message" => "Invalid JSON input."]);
    }
}
?>
