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
            // Proceed to delete attendances for the user
            $stmt = $conn->prepare("DELETE FROM attendances WHERE user_id = ?;");
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $stmt->close();

            // Proceed to delete the user
            $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?;");
            $stmt->bind_param("i", $user_id);

            if ($stmt->execute()) {
                echo json_encode(["message" => "User deleted successfully."]);
            } else {
                echo json_encode(["message" => "Failed to delete user."]);
            }

            $stmt->close();
        } else {
            echo json_encode(["message" => "Invalid JSON input."]);
        }
    }
}
?>
