<?php

session_start();

require_once '../connection/connect.php';

$is_logged_in = isset($_SESSION['user_id']) && $_SESSION['user_id'] > 0;
$username = $is_logged_in ? htmlspecialchars($_SESSION['username']) : 'Gościu';


$sql = "
SELECT 
g.username, 
g.plec,
GROUP_CONCAT(DISTINCT b.nazwa_broni SEPARATOR ', ') AS ulubione_bronie, 
GROUP_CONCAT(DISTINCT m.nazwa_mapy SEPARATOR ', ') AS ulubione_mapy
FROM 
gracze g
LEFT JOIN 
gracze_bronie gb ON g.id = gb.id_gracza
LEFT JOIN 
bronie b ON gb.id_broni = b.id_broni
LEFT JOIN 
gracze_mapy gm ON g.id = gm.id_gracza
LEFT JOIN 
mapy m ON gm.id_mapy = m.id_mapy
GROUP BY 
g.id
ORDER BY 
g.id DESC 
LIMIT 5;
";

$result = $conn->query($sql);

if (!$result) {
    $error_message_db = "Błąd wykonania zapytania do bazy danych: " . $conn->error;
    $result = null;
} else {
    $error_message_db = null;
}

?>

<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strona CS:GO - Klan Non Omnis Moriar (Panel Gracza)</title>
    <meta name="description"
        content="Oficjalna strona klanu CS:GO Non Omnis Moriar. Statystyki, drużyny, historia i rekrutacja.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
    <style>
        .table-wrapper {
            overflow-x: auto;
        }
    </style>
</head>

<body>
    <div id="dynamic-island-container">
        <div id="island" class="island-default transition-all duration-500 ease-in-out">
            <div id="island-content" class="island-content-default transition-opacity duration-200">
            </div>
        </div>
    </div>

    <header id="main-header">
        <div class="nav-container">
            <a href="index.html" class="logo">Non Omnis Moriar</a>
            <div class="list">
                <div class="item">
                    <button class="menu-trigger" id="menu07">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <div class="side-menu" id="sideMenu">
        <div class="nav-container">
            <a href="index.html" class="logo">Non Omnis Moriar</a>
            <nav class="main-nav">
                <a href="#hero-section">Start</a>
                <a href="#welcome-section">Witaj</a>
                <a href="#genesis-section">Geneza</a>
                <a href="#map-pool-section">Mapy</a>
                <a href="#tech-section">Technologia</a>
                <a href="#recruitment-section">Rekrutacja</a>
                <a href="#stats-section">Statystyki</a>
                <a href="http://bit.ly/streamy-csgo" target="_blank">Streaming</a>
            </nav>
            <button class="cta-button">
                <?php if ($is_logged_in): ?>
                    <a href="../connection/logout.php">Wyloguj (<?php echo $username; ?>)</a>
                <?php else: ?>
                    <a href="../register/index.html">Dołącz do nas</a>
                <?php endif; ?>
            </button>
        </div>
    </div>

    <div class="fixed right-0 top-0 h-full flex items-center pr-8">
        <div id="nawigacja-kropki" class="nawigacja-kropki">
            <div id="linia-aktywna"></div>
        </div>
    </div>

    <main>
        <section id="hero-section" class="dark-section section-content" data-nazwa="Start">
            <div class="container hero-content">
                <h1>Witaj <?php echo $username; ?> w Panelu Gracza Klanu Non Omnis Moriar</h1>
                <p class="subtitle">Odkryj profesjonalne statystyki, drużyny i strategię. **Nie wszystek umrę.**</p>
                <a href="#stats-section" class="primary-cta-button">Zobacz Statystyki</a>
            </div>
        </section>

        <section id="welcome-section" class="pleasure-to-meet-u section-padding section-content" data-nazwa="Witaj">
            <div class="mid-container">
                <h2>Witaj na platformie klanu!</h2>
                <p>Counter-Strike: Global Offensive (CS:GO) – wieloosobowa gra komputerowa...</p>
                <p class="source-info">Źródło: <a href="https://pl.wikipedia.org/wiki/Counter-Strike:_Global_Offensive"
                        target="_blank">Wikipedia</a></p>
            </div>
        </section>

        <section id="genesis-section" class="section-padding dark-section section-content" data-nazwa="Geneza">
            <div class="container">
                <h2>Geneza Klanu: Od Idei do Serwera</h2>
                <div class="content-columns">
                    <div>
                        <h3>Początki na Dust2</h3>
                        <p>Klan **Non Omnis Moriar** (z łac. "Nie wszystek umrę") powstał na początku 2024 roku z
                            inicjatywy grupy przyjaciół...</p>
                    </div>
                    <div>
                        <h3>Nasza Filozofia</h3>
                        <p>Nazwa klanu odzwierciedla nasze podejście: mimo porażek na mapie, duch i osiągnięcia
                            pozostają...</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="map-pool-section" class="section-padding section-content" data-nazwa="Mapy">
            <div class="container map-pool-container">
                <h2>Map Pool i Specjalizacje</h2>
                <p>Profesjonalizm w CS:GO wymaga dogłębnej znajomości wszystkich map z aktywnego puli turniejowego.
                </p>
                <div class="map-grid">
                    <div class="map-card">
                        <h3>Inferno</h3>
                        <p>**Siła:** Precyzyjne wykonywanie wejść na bombsite'y A i B...</p>
                    </div>
                    <div class="map-card">
                        <h3>Mirage</h3>
                        <p>**Siła:** Najbardziej zbalansowana mapa. Stawiamy na szybkie rotacje...</p>
                    </div>
                    <div class="map-card">
                        <h3>Nuke</h3>
                        <p>**Siła:** Specjalizujemy się w obronie górnej części (A)...</p>
                    </div>
                </div>
                <p class="map-pool-note">Aktualny Map Pool turniejowy to: Inferno, Mirage, Nuke...</p>
            </div>
        </section>

        <section id="tech-section" class="section-padding dark-section section-content" data-nazwa="Technologia">
            <div class="container">
                <h2>💻 Technologiczne Zaplecze Strony</h2>
                <p>Ta strona internetowa została stworzona w ramach projektu edukacyjnego z wykorzystaniem...</p>
                <h3>Języki i Narzędzia</h3>
                <ul>
                    <li>**HTML5:** Struktura semantyczna i dostępność.</li>
                    <li>**CSS3 (Flexbox/Grid):** Zaawansowane style i responsywny layout.</li>
                    <li>**PHP/MySQL:** Docelowo do dynamicznego ładowania statystyk graczy i logowania.</li>
                </ul>
                <h3>Fragment Kodu: Struktura Sekcji</h3>
                <pre class="code-block" style="padding: 0px 40px;">
                    <code>
                        <img src="../icons/code-snapshot-1.png" alt="example of the code used in the app" style="border-radius: 15px;">
                    </code>
                </pre>
            </div>
        </section>

        <section id="recruitment-section" class="section-padding section-content" data-nazwa="Rekrutacja">
            <div class="container recruitment-grid">
                <h2>Dołącz do Non Omnis Moriar</h2>
                <p>Stale poszukujemy ambitnych i zmotywowanych graczy...</p>
                <div class="requirements">
                    <h3>Wymagania Minimalne</h3>
                    <ul>
                        <li>**Ranga:** Min. LEM (Legendary Eagle Master)...</li>
                        <li>**Wiek:** Powyżej 16 lat...</li>
                        <li>**Dyspozycyjność:** Możliwość uczestnictwa w 3 treningach tygodniowo...</li>
                    </ul>
                </div>
                <a href="../register/index.html" class="primary-cta-button recruitment-cta">APLIKUJ JUŻ TERAZ</a>
            </div>
        </section>

        <section id="stats-section" class="section-padding dark-section section-content" data-nazwa="Statystyki">
            <div class="container">
                <h2>Statystyki Klanu i Graczy</h2>
                <p>Poniżej znajduje się lista 5 najnowszych zarejestrowanych użytkowników wraz z ich preferencjami.</p>

                <div class="table-wrapper">
                    <?php if (isset($error_message_db)): ?>
                        <p style="color: red; text-align: center;">Wystąpił błąd ładowania danych:
                            <?php echo $error_message_db; ?>
                        </p>
                    <?php elseif ($result && $result->num_rows > 0): ?>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Nick</th>
                                    <th>Płeć</th>
                                    <th>Ulubiona Broń</th>
                                    <th>Ulubiona Mapa</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($row = $result->fetch_assoc()):
                                    $bronie_display = empty($row['ulubione_bronie']) ? 'Brak' : $row['ulubione_bronie'];
                                    $mapy_display = empty($row['ulubione_mapy']) ? 'Brak' : $row['ulubione_mapy'];
                                    ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($row['username']); ?></td>
                                        <td><?php echo htmlspecialchars($row['plec']); ?></td>
                                        <td><?php echo htmlspecialchars($bronie_display); ?></td>
                                        <td><?php echo htmlspecialchars($mapy_display); ?></td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                    <?php else: ?>
                        <p class="stats-note">Brak zarejestrowanych graczy do wyświetlenia lub błąd połączenia z bazą.</p>
                    <?php endif; ?>

                    <p class="stats-note">Powyższe dane to 5 najnowszych wpisów z bazy danych.</p>
                </div>
            </div>
        </section>

        <section id="achievements-plans-section" class="section-padding section-content"
            data-nazwa="Osiągnięcia i Plany">
            <div class="container">
                <h2>Osiągnięcia i Plany na Przyszłość</h2>
                <div class="content-columns">
                    <div>
                        <h3>Kamienie Milowe</h3>
                        <ul>
                            <li>**Luty 2024:** Finalizacja podstawowego składu...</li>
                            <li>**Kwiecień 2024:** Zwycięstwo w Lidze Społecznościowej...</li>
                            <li>**Sierpień 2024:** Uruchomienie oficjalnej, responsywnej strony...</li>
                        </ul>
                    </div>
                    <div>
                        <h3>Następne Kroki</h3>
                        <ul>
                            <li>Rekrutacja drugiego składu...</li>
                            <li>Integracja z API Steam...</li>
                            <li>Udział w większych, międzynarodowych turniejach online.</li>

                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="settings-section-wrap">
            <div class="settings">
                <img src="../icons/setting.png" alt="settings" height="40px" width="40px" id="settings-icon"
                    class="cursor-pointer">

                <div id="settings-dropdown"
                    class="settings-dropdown text-white rounded-lg shadow-2xl w-40 overflow-hidden mb-2">
                    <ul class="py-2">
                        <?php if ($is_logged_in): ?>
                            <li class="px-4 py-2 cursor-pointer transition duration-150 ease-in-out">
                                <a href="../connection/logout.php" class="block" id="logout-link">Wyloguj (Logout)</a>
                            </li>
                        <?php endif; ?>

                        <li id="change-theme-li"
                            class="px-4 py-2 cursor-pointer transition duration-150 ease-in-out">
                            <a href="#" class="block">Zmień Motyw</a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </main>

    <footer class="dark-section">
        <div class="container footer-content">
            <p>&copy; 2025 Klan Non Omnis Moriar. Projekt egzaminacyjny.</p>
            <div class="footer-links">
                <a href="#contact-us">Kontakt</a>
                <a href="https://discord.gg/nasz-klan" target="_blank">Discord</a>
                <a href="http://bit.ly/streamy-csgo" target="_blank">Streaming</a>
            </div>
        </div>
    </footer>
    <script type="module" src="script.js"></script>
</body>

</html>

<?php
if ($conn) {
    $conn->close();
}
?>