<?php
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow headers for preflight requests
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Set content type to JSON
// header("Content-Type: application/json");

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

// Set the content type for the response

$servername = "db5014671413.hosting-data.io";
$username = "dbu1385363";
$password = "Str!v32Devel0pM()r3C()d3";
$dbname = "appDatabase";


$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Setup Tables
$conn->query("USE dbs12189510;");

// SQL query to create tables if they don't exist
$query = "
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        role ENUM('admin', 'user', 'member') DEFAULT 'user',  
        grade ENUM('freshman', 'sophomore', 'junior', 'senior') DEFAULT 'freshman', 
        score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(50),
        event_name VARCHAR(100) NOT NULL,
        event_details TEXT,
        event_location TEXT,
        scheduled_by VARCHAR(50),
        verification_code VARCHAR(50) UNIQUE NOT NULL,
        event_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

    CREATE TABLE IF NOT EXISTS attendances (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        verified_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (event_id) REFERENCES events(event_id),
        UNIQUE(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS print_jobs (
        job_id INT AUTO_INCREMENT PRIMARY KEY,
        job_date DATE NOT NULL,
        job_time TIME NOT NULL,
        printer VARCHAR(100) NOT NULL,
        item VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        assigned_to VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

";
// Execute the query with multi_query
if ($conn->multi_query($query)) {
    // Loop through all result sets and fetch them (to avoid "Commands out of sync" error)
    do {
        // Store the result of each query (even if we don't use it, we need to fetch it to clear the result set)
        if ($result = $conn->store_result()) {
            // You can process the result if necessary, or just free it to clear the result
            $result->free();
        }
    } while ($conn->next_result());  // Move to the next result set


}

?>