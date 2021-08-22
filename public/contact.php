<?php 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './php/PHPMailer.php';
require './php/SMTP.php';
require './php/Exception.php';

try {
    // request should be post
    if ($_SERVER["REQUEST_METHOD"] == "POST" && array_key_exists('email', $_POST)) {
        $resp = $type = $nameErr = $emailErr = $messageErr = "";
        $name = $email = $message = $choices = "";

        // honeypot field should be empty
        if (empty($_POST["choices"])) {
            // validate name
            if (empty($_POST["name"])) {
                $nameErr = "Name is required";
            } else {
                if (!preg_match("/^[a-zA-Z-' ]*$/",$name)) {
                    $nameErr = "Only letters and white space allowed";
                } else {
                    $name = test_input($_POST['name']);
                }
            }
            // validate email
            if (empty($_POST["email"])) {
                $emailErr = "Email is required";
            } else {
                if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && !PHPMailer::validateAddress($_POST['email'])) {
                    $emailErr = "Invalid email format";
                } else {
                    $email = test_input($_POST['email']);
                }
            }

            // validate message
            if (empty($_POST["message"])) {
                $messageErr = "A message is required";
            } else {
                $message = test_input($_POST['message']);
            }

            // if no errors and no empty fields
            if ($nameErr == "" && $emailErr == "" && $messageErr == "" && $name != "" && $email != "" && $message != "") {
                $mail = new PHPMailer();
                $mail->SMTPDebug = 0;
                $mail->isSMTP();
                $mail->Host = 'mail.kirkclarke.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'contact@kirkclarke.com';                     //SMTP username
                $mail->Password   = '+&ZKz?a+pDG$';                               //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
                $mail->Port = 465;                                                //https://my.bluehost.com/cgi/help/email-application-setup
                $mail->CharSet = PHPMailer::CHARSET_UTF8;
                $mail->setFrom('contact@kirkclarke.com', (empty($name) ? 'Contact form' : $name));
                $mail->addAddress('ignite@kirkclarke.com');
                $mail->addReplyTo($email, $name);
                $mail->Subject = 'New submission from contact form on Kirkclarke.com';
                $mail->Body = "Contact form submission\n\nFrom:\n" . $name . "\n" . $email . "\n\nMessage:\n" . $message;

                if (!$mail->send()) {
                    $resp = 'Mailer Error: ' . $mail->ErrorInfo;
                    $type = "warning";
                } else {
                    $resp = 'Your contact information was sent successfully.';
                    $type = "success";
                }
            }
            // handle resp
            header("Location: index.html#contact?type={$type}&resp={$resp}"); exit;
        }
        
    }
    

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

if (isset($_REQUEST["destination"])) {
    header("Location: {$_REQUEST["destination"]}"); exit;
} else if (isset($_SERVER["HTTP_REFERER"])){
    header("Location: {$_SERVER["HTTP_REFERER"]}"); exit;
} else {
    header("Location: index.html#contact"); exit;
}
function test_input($data) {
  $data = trim($data);
  $data = stripslashes(strip_tags($data));
  $data = htmlspecialchars($data);
  return $data;
}
    
?>