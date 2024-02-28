<?php
// Replace these values with your actual database credentials
$host = 'localhost';
$dbname = 'University-Resource-Hub';
$user = 'root';
$password = 'B1903ayd!';

// Create a PDO connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password
    $email = $_POST['email'];

    // Insert data into the users table (Assuming you have a PDO connection named $pdo)
    try {
        $stmt = $pdo->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute([$username, $password, $email]);

        // Return a success message
        if ($_SERVER['HTTP_ACCEPT'] === 'application/json') {
            header('Content-Type: application/json');
            echo json_encode(['message' => 'Sign-up successful']);
        } else {
            // Handle HTML response (e.g., redirect to a success page)
            header('Location: /signup-success.html');
            exit();
        }
    } catch (PDOException $e) {
        // Return an error message
        if ($_SERVER['HTTP_ACCEPT'] === 'application/json') {
            header('Content-Type: application/json');
            echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
        } else {
            // Handle HTML response (e.g., redirect to an error page)
            header('Location: /signup-error.html');
            exit();
        }
    }
}
?>
