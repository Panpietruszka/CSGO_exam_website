<?php

session_start();


require_once 'connect.php';


function redirect_with_message($location, $message, $type = 'success')
{
    

    $target_url = $location . "?message=" . urlencode($message) . "&type=" . $type;
    header("Location: " . $target_url);
    exit();
}


$form_path = "../register/index.html";
$dashboard_path = "../dashboard/index.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $form_mode = $_POST['form_mode'] ?? '';

    if ($form_mode === 'register') {
        

        
        $username = trim($_POST['user'] ?? '');
        $password = $_POST['password'] ?? '';
        $repeat_password = $_POST['repeat_password'] ?? '';
        $plec = $_POST['radio-group'] ?? ''; 
        $opis_o_sobie = trim($_POST['about-user'] ?? '');

        
        $regulamin_akceptacja = isset($_POST['regulamin-checkbox']) ? 1 : 0; 
        $newsletter = isset($_POST['newsletter-checkbox']) ? 1 : 0;

        $selected_guns = $_POST['guns'] ?? [];
        $selected_maps = $_POST['maps'] ?? [];

        
        if (empty($username) || empty($password) || empty($repeat_password) || empty($plec) || empty($opis_o_sobie)) {
            redirect_with_message($form_path, "Proszę wypełnić wszystkie wymagane pola.", "error");
        }

        if (!$regulamin_akceptacja) {
            redirect_with_message($form_path, "Akceptacja regulaminu jest obowiązkowa.", "error");
        }

        if ($password !== $repeat_password) {
            redirect_with_message($form_path, "Hasła nie są identyczne.", "error");
        }

        
        $stmt_check = $conn->prepare("SELECT id FROM gracze WHERE username = ?");
        $stmt_check->bind_param("s", $username);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            $stmt_check->close();
            redirect_with_message($form_path, "Użytkownik o tej nazwie już istnieje. Wybierz inną nazwę.", "error");
        }
        $stmt_check->close();

        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        
        $conn->begin_transaction();

        try {
            
            $sql_gracz = "INSERT INTO gracze (username, haslo, plec, akceptacja_regulaminu, newsletter, opis_o_sobie) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt_gracz = $conn->prepare($sql_gracz);
            $stmt_gracz->bind_param("sssiis", $username, $hashed_password, $plec, $regulamin_akceptacja, $newsletter, $opis_o_sobie);

            if (!$stmt_gracz->execute()) {
                throw new Exception("Błąd zapisu gracza.");
            }
            $new_player_id = $conn->insert_id;

            
            if (!empty($selected_guns)) {
                $placeholders_guns = implode(',', array_fill(0, count($selected_guns), '?'));
                $stmt_gun_ids = $conn->prepare("SELECT id_broni FROM bronie WHERE nazwa_broni IN ($placeholders_guns)");
                $types_guns = str_repeat('s', count($selected_guns));
                $stmt_gun_ids->bind_param($types_guns, ...$selected_guns);
                $stmt_gun_ids->execute();
                $result_gun_ids = $stmt_gun_ids->get_result();

                $gun_ids_to_insert = [];
                while ($row = $result_gun_ids->fetch_assoc()) {
                    $gun_ids_to_insert[] = $row['id_broni'];
                }

                $stmt_gun_ids->close();

                if (!empty($gun_ids_to_insert)) {
                    $sql_gracze_bronie = "INSERT INTO gracze_bronie (id_gracza, id_broni) VALUES (?, ?)";
                    $stmt_gracze_bronie = $conn->prepare($sql_gracze_bronie);

                    foreach ($gun_ids_to_insert as $gun_id) {
                        $stmt_gracze_bronie->bind_param("ii", $new_player_id, $gun_id);
                        if (!$stmt_gracze_bronie->execute()) {
                            throw new Exception("Błąd zapisu ulubionych broni.");
                        }
                    }
                    $stmt_gracze_bronie->close();
                }
            }

            
            if (!empty($selected_maps)) {
                $placeholders_maps = implode(',', array_fill(0, count($selected_maps), '?'));
                $stmt_map_ids = $conn->prepare("SELECT id_mapy FROM mapy WHERE nazwa_mapy IN ($placeholders_maps)");

                $types_maps = str_repeat('s', count($selected_maps));
                $stmt_map_ids->bind_param($types_maps, ...$selected_maps);
                $stmt_map_ids->execute();
                $result_map_ids = $stmt_map_ids->get_result();

                $map_ids_to_insert = [];
                while ($row = $result_map_ids->fetch_assoc()) {
                    $map_ids_to_insert[] = $row['id_mapy'];
                }

                $stmt_map_ids->close();

                if (!empty($map_ids_to_insert)) {
                    $sql_gracze_mapy = "INSERT INTO gracze_mapy (id_gracza, id_mapy) VALUES (?, ?)";
                    $stmt_gracze_mapy = $conn->prepare($sql_gracze_mapy);

                    foreach ($map_ids_to_insert as $map_id) {
                        $stmt_gracze_mapy->bind_param("ii", $new_player_id, $map_id);
                        if (!$stmt_gracze_mapy->execute()) {
                            throw new Exception("Błąd zapisu ulubionych map.");
                        }
                    }
                    $stmt_gracze_mapy->close();
                }
            }

            
            $_SESSION['user_id'] = $new_player_id;
            $_SESSION['username'] = $username;

            $conn->commit();
            redirect_with_message($dashboard_path, "Rejestracja zakończona sukcesem! Witamy, " . htmlspecialchars($username) . ".", "success");

        } catch (Exception $e) {
            $conn->rollback();
            error_log("Błąd transakcji rejestracji: " . $e->getMessage());
            redirect_with_message($form_path, "Wystąpił błąd serwera podczas rejestracji: " . $e->getMessage(), "error");
        } finally {
            if (isset($stmt_gracz) && $stmt_gracz->close())
                $stmt_gracz->close();
        }

    } elseif ($form_mode === 'login') {
        

        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            redirect_with_message($form_path, "Proszę podać nazwę użytkownika i hasło.", "error");
        }

        
        $stmt_login = $conn->prepare("SELECT id, username, haslo FROM gracze WHERE username = ?");
        $stmt_login->bind_param("s", $username);
        $stmt_login->execute();
        $stmt_login->store_result();

        if ($stmt_login->num_rows === 1) {
            
            $stmt_login->bind_result($user_id, $db_username, $hashed_password);
            $stmt_login->fetch();

            if (password_verify($password, $hashed_password)) {
                
                $_SESSION['user_id'] = $user_id;
                $_SESSION['username'] = $db_username;

                $stmt_login->close();
                redirect_with_message($dashboard_path, "Zalogowano pomyślnie. Witaj z powrotem!", "success");
            } else {
                $stmt_login->close();
                redirect_with_message($form_path, "Nieprawidłowa nazwa użytkownika lub hasło.", "error");
            }
        } else {
            $stmt_login->close();
            redirect_with_message($form_path, "Nieprawidłowa nazwa użytkownika lub hasło.", "error");
        }

    } else {
        redirect_with_message($form_path, "Niepoprawny tryb formularza.", "error");
    }

} else {
    redirect_with_message($form_path, "Błąd: Dostęp tylko poprzez formularz POST.", "error");
}

$conn->close();
?>