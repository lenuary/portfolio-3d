# Portfolio 3D — Łukasz

Interaktywne portfolio zbudowane w Nuxt, Vue i TypeScript. Scena Three.js przedstawia pokój, a sekcje Home, About, Projects i Contact otwierają się z animowanymi przejściami kamery.

## Funkcje

- Karta profilu z efektem przechylania 3D.
- Karuzela projektów obsługiwana przyciskami, klawiaturą i gestami.
- Podgląd gry w WebM/MP4 z kontrolą odtwarzania.
- Formularz kontaktowy przygotowujący wiadomość w aplikacji pocztowej.
- Responsywny układ, widoczny fokus i obsługa ograniczonych animacji.
- Nawigacja działająca również bez dostępnej sceny WebGL.

## Uruchomienie

Wymagany Node.js 24.22.2, zgodnie z `.nvmrc`.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 3001
```

Podgląd: http://127.0.0.1:3001.

## Kontrole i build

```sh
npm test
npm run test:contrast
npm run typecheck
npm run format:check
npm run build
npm run preview
```

`npm run format` formatuje kod. `npm run test:preview` sprawdza odpowiedzi uruchomionego serwera produkcyjnego; domyślny adres to http://127.0.0.1:3001.

## Struktura

```text
app/
  assets/       wspólne style
  components/   sekcje i elementy interfejsu
  composables/  nawigacja, scena i animacje
  data/         treści oraz dane projektów
public/         model 3D, obrazy i filmy
scripts/        kontrole kontrastu i odpowiedzi HTTP
tests/          testy danych oraz logiki animacji
```

Treści edytuje się w `app/data`. Ustawienia kamery znajdują się w `app/composables/useOfficeScene.ts`.

Formularz kontaktowy korzysta z `mailto:` i wymaga skonfigurowanej aplikacji pocztowej. Nie wysyła wiadomości przez serwer.
