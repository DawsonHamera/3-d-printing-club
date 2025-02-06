<?php

// Include the db.php file to get the database connection
include('db.php');  // Adjust the path if necessary

header("Content-Type: application/json");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Read the raw POST data (assuming the request is JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // Ensure all required data is provided
    if (isset($data['first_name'], $data['last_name'], $data['email'], $data['password'], $data['grade'])) {

        // Sanitize the input
        $first_name = $conn->real_escape_string($data['first_name']);
        $last_name = $conn->real_escape_string($data['last_name']);
        $email = $conn->real_escape_string($data['email']);
        $password = $conn->real_escape_string($data['password']);
        $grade = $conn->real_escape_string($data['grade']);

        // Hash the password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        // Check if the email already exists
        $checkQuery = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(["error" => "Email is already registered"]);
            $stmt->free_result();  // Free the result set
            $stmt->close();
            exit();
        }

        // Insert the new user into the database
        $insertQuery = "INSERT INTO users (username, first_name, last_name, email, password_hash, grade) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $username = $first_name . $last_name; 
        $stmt->bind_param("ssssss", $username, $first_name, $last_name, $email, $password_hash, $grade);
        if ($stmt->execute()) {
            echo json_encode(["success" => "Account created successfully"]);
        } else {
            echo json_encode(["error" => "Error creating account: " . $conn->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["error" => "Missing required fields"]);
    }

} else {
    echo json_encode(["error" => "Invalid request method"]);
}

// Close the database connection
$conn->close();

?>
