# Glosmästaren v3

Installerbar PWA. PIN 6666 låser upp adminmenyn (endast enkel UI-spärr).

## Publicera
1. Skapa en lista i adminläge, fota eller skriv in orden, kontrollera översättningarna.
2. Tryck **Publicera**. Appen försöker kopiera JSON-texten och öppnar GitHubs redigeringssida för `glosor.json`.
3. Logga in på GitHub vid behov, markera allt i filens redigeringsruta, klistra in och välj **Commit changes**.
4. På andra enheter, välj **Hämta glosor**.

Om iOS inte tillåter urklipp, öppna **Visa glosorna för manuell kopiering**, markera texten och kopiera.

Obs: Appen kan inte automatiskt skriva till GitHub utan säker autentisering. PIN-koden är synlig i den publika JavaScript-koden och ger inget säkerhetsskydd för repositoryt. Publicera inte personuppgifter. OCR kräver internet och kan misstolka ord; granska alltid.
