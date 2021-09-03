<?php 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './php/PHPMailer.php';
require './php/SMTP.php';
require './php/Exception.php';
require './php/EmailConfig.php';

try {
    // 
    if (array_key_exists('email', $_POST)) {
        
        $resp = $type = $nameErr = $emailErr = $messageErr = "";
        $name = $email = $message = $choices = "";

        // honeypot field should be empty
        if ($_POST["choices"] == '') {
            //validate recaptcha - https://codeforgeek.com/google-recaptcha-v3-tutorial/
            if ($_POST["g-recaptcha-response"] == '') {
                $resp = 'Mailer Error: reCaptcha failed';
                $type = "warning";
            } else {
                $captchaPubicKey = $_POST["g-recaptcha-response"];
                $verify_url = 'https://www.google.com/recaptcha/api/siteverify';
                $data = array('secret' => $recaptchaSecret, 'response' => $captchaPubicKey);

                $options = array(
                    'http' => array(
                    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                    'method'  => 'POST',
                    'content' => http_build_query($data)
                    )
                );
                $context  = stream_context_create($options);
                $response = file_get_contents($verify_url, false, $context);
                $responseKeys = json_decode($response,true);
                header('Content-type: application/json');
                if (!$responseKeys["success"]) {
                    $resp = 'reCaptcha failed validation';
                    $type = 'fail';
                    echo json_encode(array('type' => $type, 'resp' => $resp));
                }
            }
            // validate name
            if ($_POST["name"] == '') {
                $nameErr = "Name is required";
            } else {
                if (!preg_match("/^[a-zA-Z-' ]*$/",$name)) {
                    $nameErr = "Only letters and white space allowed";
                } else {
                    $name = test_input($_POST['name']);
                }
            }
            // validate email
            if ($_POST["email"] == '') {
                $emailErr = "Email is required";
            } else {
                if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) && !PHPMailer::validateAddress($_POST['email'])) {
                    $emailErr = "Invalid email format";
                } else {
                    $email = test_input($_POST['email']);
                }
            }

            // validate message
            if ($_POST["message"] == '') {
                $messageErr = "A message is required";
            } else {
                $message = test_input($_POST['message']);
            }

            // if no errors and no empty fields
            if ($nameErr == "" && $emailErr == "" && $messageErr == "" && $name != "" && $email != "" && $message != "") {
                $mail = new PHPMailer();
                $mail->SMTPDebug = 0;
                $mail->isSMTP();
                $mail->Host = $host;
                $mail->SMTPAuth   = true;
                $mail->Username   = $username;                     //SMTP username
                $mail->Password   = $password;                               //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
                $mail->Port = $port;                                                
                $mail->CharSet = PHPMailer::CHARSET_UTF8;
                $mail->setFrom($username, (isset($name) ? 'Contact form' : $name));
                $mail->addAddress($addressEmail);
                $mail->addReplyTo($email, $name);
                $mail->Subject = 'New submission from contact form on Kirkclarke.com';
                $mail->Body = "Contact form submission\n\nFrom:\n" . $name . "\n" . $email . "\n\nMessage:\n" . $message;

                if (!$mail->send()) {
                    $resp = 'Mailer Error: ' . $mail->ErrorInfo;
                    $type = "fail";
                } else {
                    $resp = 'Your contact information was sent successfully.';
                    $type = "success";
                }
            }
            // handle resp
            echo json_encode(array('type' => $type, 'resp' => $resp));
            exit;
        }
        
    }
    

} catch (Exception $e) {
    $resp = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    $type = "fail";
    echo json_encode(array('type' => $type, 'resp' => $resp));
}

// if (isset($_REQUEST["destination"])) {
//     header("Location: {$_REQUEST["destination"]}"); exit;
// } else if (isset($_SERVER["HTTP_REFERER"])){
//     header("Location: {$_SERVER["HTTP_REFERER"]}"); exit;
// } else {
//     header("Location: index.html#contact"); exit;
// }
function test_input($data) {
  $data = trim($data);
  $data = stripslashes(strip_tags($data));
  $data = htmlspecialchars($data);
  return $data;
}
    
?>