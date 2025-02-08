<?php
// Include the db.php file to get the database connection
include('db.php');  // Adjust the path if necessary

header("Content-Type: application/json");

// Secret key for encoding and decoding the JWT (should be stored securely)
$secret_key = "Mh.B<^(rej9ezHRykXcz6v(*Qlo&R'";  // Change this to a secure random string

// Function to create a JWT
function create_jwt($payload, $secret_key) {
    // Header
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);

    // Base64Url encode the header
    $base64UrlHeader = base64UrlEncode($header);

    // Payload
    $payload = json_encode($payload);

    // Base64Url encode the payload
    $base64UrlPayload = base64UrlEncode($payload);

    // Signature: HMACSHA256( Header + "." + Payload , secret_key)
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);

    // Base64Url encode the signature
    $base64UrlSignature = base64UrlEncode($signature);

    // Combine all parts: Header + Payload + Signature
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Function to base64Url encode (needed for JWT encoding)
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the raw POST data (assuming the request is JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // Ensure both email and password are provided
    if (isset($data['email'], $data['password'])) {
        $email = $conn->real_escape_string($data['email']);
        $password = $conn->real_escape_string($data['password']);

        // Check if the email exists in the database
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Fetch user data
            $user = $result->fetch_assoc();

            // Verify the password
            if (password_verify($password, $user['password_hash'])) {
                // Password is correct, generate JWT

                // Create the payload with user_id and email (you can add more claims here)
                $payload = array(
                    "iss" => "your_issuer_name",  // Issuer (optional)
                    "aud" => "your_audience_name",  // Audience (optional)
                    "iat" => time(),  // Issued at time
                    "exp" => time() + 3600,  // Expiration time (1 hour)
                    "user_id" => $user['user_id'],  // Store user_id in JWT
                    "email" => $user['email'],  // Store email in JWT
                    "first_name" => $user['first_name'],  // User's first name
                    "last_name" => $user['last_name'],    // User's last name
                    "role" => $user['role']     
                );

                // Encode the JWT using the secret key
                $jwt = create_jwt($payload, $secret_key);

                // Send success response with JWT
                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "jwt" => $jwt
                ]);
            } else {
                // Password doesn't match
                echo json_encode([
                    "error" => "Invalid credentials"
                ]);
            }
        } else {
            // Email doesn't exist in the database
            echo json_encode([
                "error" => "User not found"
            ]);
        }

        $stmt->close();
    } else {
        // Missing required fields
        echo json_encode([
            "error" => "Email and password are required"
        ]);
    }
} else {
    // Invalid request method
    echo json_encode([
        "error" => "Invalid request method"
    ]);
}

// Close the database connection
$conn->close();
?>
