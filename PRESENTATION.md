# Speser

Speser è un gestore di bilancio familiare su piattaforma web. Gli utenti registrati possono caricare spese, condividerle in parti non necessariamente uguali e visualizzare un bilancio di dare/avere. Le funzioni principali includono la visualizzazione del bilancio personale, del bilancio rispetto ad un altro utente e la possibilità di creare, modificare o cancellare spese. L'autenticazione avviene tramite username e password, con una divisione del progetto tra server e client.

## Tecnologie utilizzate

- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Piattaforma di containerizzazione

### Tecnonologie client

- [vue](https://www.npmjs.com/package/vue) - Framework per l'interfaccia utente
- [vue-cookies](https://www.npmjs.com/package/vue-cookies) - Gestione dei cookie in Vue.js
- [vue-router](https://www.npmjs.com/package/vue-router) - Routing per Vue.js
- [@tabler/icons-vue](https://www.npmjs.com/package/@tabler/icons-vue) - Icone
- [pinia](https://www.npmjs.com/package/pinia) - Gestione dello stato in Vue.js
- [vue-toastification](https://www.npmjs.com/package/vue-toastification) - Notifiche toast per Vue.js
- [tailwindcss](https://www.npmjs.com/package/tailwindcss) - Framework CSS utility-first
- [daisyui](https://www.npmjs.com/package/daisyui) - Plugin UI per Tailwind CSS


### Tecnologie server

- [express](https://www.npmjs.com/package/express) - Framework per il server
- [express-validator](https://www.npmjs.com/package/express-validator) - Middleware per la validazione dei dati
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - Crittografia delle password
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Generazione e verifica dei token JWT
- [pg](https://www.npmjs.com/package/pg) - Client PostgreSQL per Node.js
- [dotenv](https://www.npmjs.com/package/dotenv) - Caricamento delle variabili d'ambiente

### Altre dipendenze di sviluppo

- [@playwright/test](https://www.npmjs.com/package/@playwright/test) - Testing end-to-end
- [@rushstack/eslint-patch](https://www.npmjs.com/package/@rushstack/eslint-patch) - Patch per ESLint
- [@tailwindcss/typography](https://www.npmjs.com/package/@tailwindcss/typography) - Plugin di tipografia per Tailwind CSS
- [@vitejs/plugin-vue](https://www.npmjs.com/package/@vitejs/plugin-vue) - Plugin Vue per Vite
- [@vue/eslint-config-prettier](https://www.npmjs.com/package/@vue/eslint-config-prettier) - Configurazione ESLint per Vue.js
- [@vue/test-utils](https://www.npmjs.com/package/@vue/test-utils) - Utility per testare componenti Vue.js
- [autoprefixer](https://www.npmjs.com/package/autoprefixer) - Plugin PostCSS per aggiungere prefissi ai CSS
- [eslint](https://www.npmjs.com/package/eslint) - Linter per JavaScript
- [eslint-plugin-vue](https://www.npmjs.com/package/eslint-plugin-vue) - Regole ESLint per Vue.js
- [jsdom](https://www.npmjs.com/package/jsdom) - Implementazione JavaScript del DOM e delle API del browser
- [postcss](https://www.npmjs.com/package/postcss) - Strumento per trasformare i CSS
- [prettier](https://www.npmjs.com/package/prettier) - Formatter per il codice
- [vite](https://www.npmjs.com/package/vite) - Strumento di sviluppo che serve, costruisce e precompila i progetti
- [vitest](https://www.npmjs.com/package/vitest) - Strumento di test per Vite

## Database

Il database è composto da quattro tabelle:

1. `users`: Questa tabella memorizza le informazioni degli utenti, come username, nome, cognome, hash della password e la data di creazione dell'utente. L'ID dell'utente è la chiave primaria.

2. `categories`: Questa tabella memorizza le categorie di spese. Ogni categoria ha un ID (chiave primaria) e un nome.

3. `expenses`: Questa tabella memorizza le informazioni sulle spese. Ogni spesa ha un ID (chiave primaria), un ID utente (che fa riferimento alla tabella `users`), una data, una descrizione, un ID categoria (che fa riferimento alla tabella `categories`), un costo totale e una data di creazione.

4. `expense_shares`: Questa tabella gestisce come le spese sono condivise tra gli utenti. Ogni condivisione di spesa ha un ID (chiave primaria), un ID spesa (che fa riferimento alla tabella `expenses`), un ID utente (che fa riferimento alla tabella `users`) e una quota.

Sono poi presenti indici sulle seguenti colonne per velocizzare le ricerche: `date`, `user_id` e `category_id` della tabella `expenses`, le colonne `expense_id` e `user_id` della tabella `expense_shares`, la colonna `username` della tabella `users` e la colonna `name` della tabella `categories`.

## Backend

Il backend è stato sviluppato con Node.js e Express. Si compone di:

1. `index.js`: Questo file contiene il codice per avviare il server.
2. `db.js`: Questo file contiene il codice per connettersi al database e per eseguire le query.
3. `routes.js`: Questo file contiene il codice per gestire il routing delle richieste.
4. `utils.js`: Questo file contiene il codice per gestire le funzioni di utilità.
5. `controllers/budgetController.js`: Questo file contiene il codice per il funzionamento delle API.
6. `/public`: Questa cartella contiene i file statici del frontend.

### API

Sono presenti due API pubbliche per la registrazione e l'autenticazione. Le altre API sono accessibili solo agli utenti autenticati.

### Autenticazione

L'autenticazione avviene tramite username e password. La password viene crittografata con bcrypt e viene generato un token JWT che contiene l'ID dell'utente.


## Frontend

Il frontend è stato sviluppato con Vue.js, Vite e Tailwind CSS.\
Per velocizzare lo sviluppo sono stati utilizzati i componenti di DaisyUI.

### Autenticazione

L'autenticazione avviene tramite username e password, mandati al server tramite una richiesta POST. Se l'autenticazione ha successo, viene salvato il token JWT nei cookie e l'utente viene reindirizzato alla pagina principale.

### Interfaccia utente

Sono presenti 2 pagine per l'autenticazione:
1. `SignIn`: Questa pagina permette di effettuare il login.
2. `SignUp`: Questa pagina permette di effettuare la registrazione.

Dopo l'accesso l'interfaccia utente è composta da 5 pagine principali:

1. `Home`: Questa pagina mostra il bilancio personale dell'utente.
2. `Expenses`: Questa pagina mostra le spese dell'utente, con la possibilità di filtrarle per anno, mese e cercare le spese.
3. `AddExpense`: Questa pagina permette di aggiungere una spesa.
4. `Balance`: Questa pagina mostra il bilancio e le spese condivise con altri utenti. Cliccando sull'icona cerca utente è possibile cercare un utente e vedere il bilancio rispetto a lui.
5. `UserInfo`: Questa pagina permette di vedere l'utente corrente e di effettuare il logout.

Cliccando su una specifica spesa è possibile visualizzare i dettagli della spesa e modificarla (La modifica è possibile solo se l'utente è il proprietario della spesa).

### Rimborso

Se si ha un debito rispetto ad un utente è possibile rimborsarlo creando una nuova spesa nel seguente modo:

- Cliccare sul toggle **"This is a refund"**, in modo da attivare la modalità rimborso.
- Aggiugnere la data e una descrizione.
- Aggiungere l'utente a cui si vuole rimborsare dal bottone **"Add User"** e inserire la quota da rimborsare.
- Cliccare sul bottone **"Add Expense"** per aggiungere la spesa.

## Sviluppi futuri

Principali sviluppi futuri:

- [ ] Aggiungere la possibilità di eliminare le spese.
- [ ] Aggiungere la possibilità di eliminare il proprio account.
- [ ] Aggiungere la possibilità di modificare il proprio account.
- [ ] Aggiungere la possibilità di filtrare le spese per categoria.
- [ ] Aggiungere la possibilità di aggiungere categorie personalizzate.
- [ ] Aggiungere la possibilità di aggiungere spese ricorrenti.
- [ ] Migliorare il processo di rimborso (es. dal dettaglio della spesa).

