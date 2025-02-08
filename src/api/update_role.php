<?php
// include 'auth.php';
include 'auth.php';

if ($auth_level === 'admin') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON input
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data) {
            $user_id = $data['user_id'];
            $role = $data['role'];

            // Proceed to assign the job
            $stmt = $conn->prepare("UPDATE users SET role=? WHERE user_id=?");
            $stmt->bind_param("ss", $role, $user_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Role updated successfully."]);
            } else {
                echo json_encode(["message" => "Failed to update role."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
}
?>
