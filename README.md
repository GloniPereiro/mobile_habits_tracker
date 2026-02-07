# Mood & Habit Tracker 🌿

Minimalistyczna aplikacja mobilna do śledzenia nawyków i nastroju, zbudowana w stosie MERN (MongoDB, Express, React Native, Node.js).

## o aplikacji
Aplikacja pozwala na codzienne monitorowanie nawyków w podziale na pory dnia. Posiada nowoczesny, ciemny interfejs z zielonymi akcentami oraz interaktywny pasek postępu.

### Główne funkcje:
- **Zunifikowany Pasek Postępu**: Wizualizacja wszystkich dzisiejszych nawyków w jednym rzędzie kwadratów na górze ekranu.
- **Stałe Nawyki**: Raz dodany nawyk pojawia się każdego dnia.
- **Podział na Pory Dnia**: Grupowanie zadań na poranne, dzienne i wieczorne.
- **Historia**: Możliwość przeglądania postępów z poprzednich dni za pomocą kalendarza.
- **Responsywność**: Interfejs dostosowany do urządzeń z systemem Android i iOS.

## Struktura Projektu
```text
Aplikacja habits/
├── backend/                # Serwer Node.js & Express
│   ├── models/             # Schematy bazy danych (Habit, Log)
│   ├── routes/             # Endpointy API
│   └── server.js           # Główny plik serwera
└── frontend/               # Aplikacja React Native (Expo)
    ├── src/
    │   ├── components/     # Komponenty UI (np. HabitTile)
    │   ├── screens/        # Ekrany (Główny ekran HabitScreen)
    │   ├── services/       # Komunikacja z API (axios)
    │   └── theme.js        # Definicje kolorów i stylów
    └── App.js              # Główny punkt wejścia aplikacji
```

## Instrukcja Uruchomienia

### 1. Wymagania
- Node.js zainstalowany na komputerze.
- Uruchomiona lokalna instancja MongoDB (domyślnie: `mongodb://localhost:27017/habit_tracker`).

### 2. Uruchomienie Backend (Serwer)
Otwórz terminal w folderze `backend`:
```bash
npm install
npm run dev
```
Serwer domyślnie uruchomi się na porcie `5000`.

### 3. Uruchomienie Frontend (Aplikacja Mobilna)
Otwórz terminal w folderze `frontend`:
```bash
npm install
npx expo start
```
Postępuj zgodnie z instrukcjami Expo, aby uruchomić aplikację w symulatorze lub na fizycznym urządzeniu przez aplikację **Expo Go**.

---

## Problem, który rozwiązuje aplikacja
Wiele osób zmaga się z brakiem systematyczności w budowaniu nawyków oraz trudnością w obiektywnej ocenie swojego samopoczucia w dłuższym terminie. Aplikacja rozwiązuje ten problem poprzez:
- **Redukcję przeciążenia poznawczego**: Minimalistyczny interfejs skupia uwagę na tym, co ważne "tu i teraz".
- **Natychmiastową gratyfikację**: Wizualny pasek postępu daje poczucie satysfakcji z każdego ukończonego zadania.
- **Świadomość trendów**: Kalendarz pozwala dostrzec wzorce zachowań, które wpływają na nastrój.

## Potencjał Komercyjny
Mood & Habit Tracker ma solidne podstawy do komercjalizacji w modelu **Freemium** lub **SaaS** (Software as a Service):
- **Model Subskrypcyjny**: Dostęp do zaawansowanych statystyk, kopii zapasowej w chmurze i personalizowanych porad.
- **Mikropłatności**: Ekskluzywne motywy wizualne, zestawy ikon lub dodatkowe dźwięki motywacyjne (np. confetti premium).
- **Wersja B2B**: Narzędzie dla firm dbających o *well-being* pracowników (anonimowe statystyki nastroju w zespołach).

## Plan Rozwoju (Roadmap)

### Etap 1: Ulepszenia UX & Core (Krótkoterminowe)
- [ ] **Powiadomienia Push**: Przypomnienia o nawykach w wybranych porach dnia.
- [ ] **System Punktów/Grywalizacja**: Zdobywanie poziomów i odznak za serie dni (streaks).
- [ ] **Wybór Ikon**: Możliwość przypisania konkretnej ikony do każdego nawyku.

### Etap 2: Analityka i Dane (Średnioterminowe)
- [ ] **Ekran Statystyk**: Wykresy kołowe i liniowe pokazujące skuteczność w skali miesiąca.
- [ ] **Korelacja Nastroju**: Automatyczne sprawdzanie, jak wykonanie konkretnych nawyków (np. sport) wpływa na ogólny nastrój.
- [ ] **Export Danych**: Możliwość pobrania raportu w formacie PDF lub CSV.

### Etap 3: Społeczność i Ekosystem (Długoterminowe)
- [ ] **Synchronizacja w Chmurze**: Logowanie przez Google/Apple, aby mieć dane na wielu urządzeniach.
- [ ] **Wyzwania Grupowe**: Możliwość budowania nawyków wspólnie ze znajomymi.
- [ ] **Integracja z Apple Health / Google Fit**: Automatyczne odhaczanie nawyków związanych z aktywnością fizyczną.


