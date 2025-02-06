<?php
$secret_key = "your_secret_key_here";
header("Access-Control-Allow-Headers: Authorization, Token");

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

// Function to base64Url encode (needed for JWT encoding)
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}


function verify_jwt($jwt, $secret_key) {
    // Split the JWT into its three parts (header, payload, signature)
    list($header, $payload, $signature) = explode('.', $jwt);
    
    // Decode the header and payload from Base64Url encoding to JSON
    $decoded_header = json_decode(base64UrlDecode($header), true);
    $decoded_payload = json_decode(base64UrlDecode($payload), true);

    // Check if token is expired
    if (isset($decoded_payload['exp']) && $decoded_payload['exp'] < time()) {
        echo 'Expired';
        return false;
    }

    // Create the valid signature by hashing the concatenated header and payload
    $valid_signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", $secret_key, true));
    // Compare the generated signature with the one in the JWT
    if ($valid_signature === $signature) {
        return $decoded_payload['role'];
    }
    else {
        return false;
    }
}

$auth_header = $_SERVER['HTTP_TOKEN'] ?? '';

if (preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
    $jwt = $matches[1];
} else {
    echo json_encode([
        "error" => "Proper authorization is required to access this resource"
    ]);
    exit; // Ensure the script terminates early if no token is found
}

$verify = verify_jwt($jwt, $secret_key);
if (!$verify) {
    echo json_encode([
        "error" => "Malformed authentication token. Please be notified that any attempts to bypass security is unathorised. This request has been flagged for security reasons."
    ]);
    exit; // Ensure the script terminates early if the token is invalid
}
else {
   $auth_level = $verify;
}
?>
