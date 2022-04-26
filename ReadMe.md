# Hinweise zum Programmierbeispiel

<!--
  Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

[Juergen Zimmermann](mailto:Juergen.Zimmermann@h-ka.de)

> Diese Datei ist in Markdown geschrieben und kann mit `<Strg><Shift>v` in
> Visual Studio Code leicht gelesen werden. Dazu wird die Extension
> _Markdown Preview Mermaid Support_ empfohlen, um UML-Diagramme in der Syntax
> von _Mermaid_ (wie bei PlantUML) visualisieren zu können.
>
> Näheres zu Markdown gibt es z.B. bei [Markdown Guide](https://www.markdownguide.org/)
>
> Nur in den ersten beiden Vorlesungswochen kann es Unterstützung bei
> Installationsproblemen geben.

## Inhalt

- [Hinweise zum Programmierbeispiel](#hinweise-zum-programmierbeispiel)
  - [Inhalt](#inhalt)
  - [Download- und ggf. Upload Geschwindigkeit](#download--und-ggf-upload-geschwindigkeit)
  - [Vorbereitung der Installation](#vorbereitung-der-installation)
  - [Literatur zu ESM](#literatur-zu-esm)
  - [Eigener Namespace in Kubernetes](#eigener-namespace-in-kubernetes)
  - [MongoDB](#mongodb)
    - [MongoDB mit Docker Compose](#mongodb-mit-docker-compose)
    - [MongoDB mit Skaffold](#mongodb-mit-skaffold)
  - [Administration des Kubernetes-Clusters](#administration-des-kubernetes-clusters)
  - [Node Best Practices](#node-best-practices)
  - [Lokaler Appserver (mit Nest)](#lokaler-appserver-mit-nest)
    - [Entwicklung in einer Powershell](#entwicklung-in-einer-powershell)
    - [OpenAPI](#openapi)
    - [Apollo Sandbox](#apollo-sandbox)
    - [REST Client für eine REST- und eine GraphQL-Schnittstelle](#rest-client-für-eine-rest--und-eine-graphql-schnittstelle)
    - [Postman](#postman)
  - [Tests aufrufen](#tests-aufrufen)
  - [Docker-Image durch Buildpacks](#docker-image-durch-buildpacks)
  - [Deployment in Kubernetes](#deployment-in-kubernetes)
    - [MongoDB als Voraussetzung](#mongodb-als-voraussetzung)
    - [Deployment mit kubectl und Kustomize](#deployment-mit-kubectl-und-kustomize)
    - [Continuous Deployment mit Skaffold](#continuous-deployment-mit-skaffold)
  - [Codeanalyse durch ESLint und SonarQube](#codeanalyse-durch-eslint-und-sonarqube)
  - [Sicherheitsanalyse durch snyk](#sicherheitsanalyse-durch-snyk)
  - [AsciiDoctor und PlantUML](#asciidoctor-und-plantuml)
    - [Preview von PlantUML-Dateien](#preview-von-plantuml-dateien)
    - [Einstellungen für Preview von AsciiDoctor-Dateien](#einstellungen-für-preview-von-asciidoctor-dateien)
    - [Preview von AsciiDoctor-Dateien](#preview-von-asciidoctor-dateien)
    - [Dokumentation im Format HTML](#dokumentation-im-format-html)
  - [Continuous Integration mit Jenkins](#continuous-integration-mit-jenkins)
    - [Aufruf mit Webbrowser](#aufruf-mit-webbrowser)
    - [Bash zur evtl. Fehlersuche im laufenden Jenkins-Container](#bash-zur-evtl-fehlersuche-im-laufenden-jenkins-container)
  - [Monitoring durch clinic](#monitoring-durch-clinic)
  - [Visual Studio Code oder WebStorm als Entwicklungsumgebung](#visual-studio-code-oder-webstorm-als-entwicklungsumgebung)
  - [Atlas](#atlas)
    - [Atlas von MongoDB](#atlas-von-mongodb)
    - [Registrierung bei Atlas](#registrierung-bei-atlas)
    - [Einloggen](#einloggen)
    - [Projekt erstellen](#projekt-erstellen)
    - [Cluster erstellen](#cluster-erstellen)
    - [DB-Benutzer erstellen](#db-benutzer-erstellen)
    - [Zulässige IP-Adressen für die DB-Clients](#zulässige-ip-adressen-für-die-db-clients)
    - [URL für künftige DB-Verbindungen](#url-für-künftige-db-verbindungen)
    - [Ausloggen bei Atlas](#ausloggen-bei-atlas)
    - [Datenbank acme erstellen](#datenbank-acme-erstellen)
    - [DB-Browser für Atlas](#db-browser-für-atlas)
  - [Heroku](#heroku)
    - [Heroku von Salesforce](#heroku-von-salesforce)
    - [dyno, slug und buildpack](#dyno-slug-und-buildpack)
    - [Registrierung bei Heroku](#registrierung-bei-heroku)
    - [Einmalig: Git-Repository erstellen](#einmalig-git-repository-erstellen)
    - [Einloggen und Token erstellen mit der Heroku CLI](#einloggen-und-token-erstellen-mit-der-heroku-cli)
    - [Leere Anwendung für Heroku erstellen](#leere-anwendung-für-heroku-erstellen)
    - [Umgebungsvariable für Heroku](#umgebungsvariable-für-heroku)
    - [Deployment für Heroku](#deployment-für-heroku)
    - [Status-Informationen zu Heroku](#status-informationen-zu-heroku)
    - [Verfügbarkeit der eigenen Heroku-Anwendung](#verfügbarkeit-der-eigenen-heroku-anwendung)
    - [Heroku-Console](#heroku-console)
    - [Dashboard für die Verwaltung der eigenen Heroku-Anwendung(en)](#dashboard-für-die-verwaltung-der-eigenen-heroku-anwendungen)
    - [Sonstige Heroku-Kommandos](#sonstige-heroku-kommandos)
  - [Empfohlene Code-Konventionen](#empfohlene-code-konventionen)

---

## Download- und ggf. Upload Geschwindigkeit

In einem Webbrowser kann man z.B. mit der URL `https://speed.cloudflare.com` die
Download- und die Upload-Geschwindigkeit testen.

Alternativ kann man durch das Kommando `fast` in einer Powershell die aktuelle
Download-Geschwindigkeit ermitteln.

Mit der zusätzlichen Option `--upload` kann zusätzlich die aktuelle
Upload-Geschwindigkeit ermittelt werden.

---

## Vorbereitung der Installation

- Das Beispiel _nicht_ in einem Pfad mit _Leerzeichen_ installieren.
  Viele Javascript-Bibliotheken werden unter Linux entwickelt und dort benutzt
  man **keine** Leerzeichen in Pfaden. Ebenso würde ich das Beispiel nicht auf
  dem  _Desktop_ auspacken bzw. installieren.

- Bei [GitHub](https://github.com) oder [GitLab](https://gitlab.com)
  registrieren, falls man dort noch nicht registriert ist.

---

## Literatur zu ESM

ESM ist die gängige Abkürzung für _ES Modules_, so dass man `import` und
`export` statt `require()` aus _CommonJS_ verwenden kann. Die Unterstützung von
ESM wurde in Node ab Version 12 begonnen. Außerdem ist es wichtig, das man beim
Umstieg auf ESM auch die Unterstützung in _ts-node_ und _ts-jest_ beachtet.

Wenn man ESM verwendet, muss man die eigenen Module z.B. folgendermaßen
importieren:

```JavaScript
    import { myFunc } from './foo.js';
    import { myClass } from './bar/index.js';
```

Außerdem gibt es ab Node 17.1 das _Node Protocol_ für den Import von
_Builtin Modules_, z.B.:

```JavaScript
    import { resolve } from 'node:path';
```

Gute Literatur zu ESM gibt es bei:

- https://nodejs.org/api/esm.html#esm_node_imports
- https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
- https://docs.joshuatz.com/cheatsheets/node-and-npm/node-esm
- https://github.com/TypeStrong/ts-node/issues/1007

## Eigener Namespace in Kubernetes

Ein neuer Namespace in Kubernetes, z.B. `acme`, wird durch folgendes Kommando
angelegt:

```PowerShell
    kubectl create namespace acme
```

---

## MongoDB

### MongoDB mit Docker Compose

Wenn man den eigenen Server direkt mit Windows - nicht mit Kubernetes -
laufen lässt, kann man MongoDB einfach mit _Docker Compose_ starten:

```PowerShell
    cd extras\mongodb
    docker compose up

    # Herunterfahren in einer 2. Shell:
    cd extras\mongodb
    docker compose down
     #>
```

### MongoDB mit Skaffold

Zunächst muss _MongoDB_ als (Backend-) Server gestartet werden, was mit
_Skaffold_ gemacht werden kann. Wenn die Umgebungsvariable `SKAFFOLD_PROFILE`
auf den Wert `dev` gesetzt ist, dann wird das Profile `dev` verwendet, welches
das Kustomize-Overlay `dev` aufruft. Das Deployment kann auf einem Notebook
einige Minuten dauern.

```PowerShell
    cd extras\mongodb
    skaffold dev
```

Mit `<Strg>C` kann das Deployment wieder zurückgerollt werden. Dabei muss
man manuell das _PersistentVolumeClaim_ mit dem Namen `data-volume-mongodb-0`
löschen, das durch das _StatefulSet_ `mongodb` implizit erstellt wurde. Dazu
gibt es im gleichen Verzeichnis das Skript `delete-pvc.ps1`.

## Administration des Kubernetes-Clusters

Zur Administration des Kubernetes-Clusters ist für Entwickler*innen m.E. _Lens_
von Mirantis oder _Octant_ von VMware Tanzu oder _Kui_ von IBM gut geeignet.

---

## Node Best Practices

Sehr empfehlenswert ist https://github.com/goldbergyoni/nodebestpractices

---

## Lokaler Appserver (mit Nest)

### Entwicklung in einer Powershell

Durch `npm run start:dev` wird der Appserver im _Watch_-Modus für die
Entwicklung gestartet, d.h. bei Code-Änderungen wird der Server automatisch
neu gestartet.

Beim Starten des Appservers wird außerdem mit _mongoose_ auf _MongoDB_
zugegriffen. Der Benutzername und das Passwort sind in der Datei
`src\config\db.ts` auf `admin` und `p` voreingestellt. Für MongoDB muss
_Port-Forwarding_ (s.o.) aktiviert sein. Dazu muss die Umgebungsvariable
`DB_HOST` in `.env` auskommentiert sein oder auf den Defaultwert `localhost`
gesetzt sein. Durch die Umgebungsvariable `DB_POPULATE` und `DB_POPULATE_FILES`
wird festgelegt, ob die (Test-) DB `acme` neu geladen wird und ob dabei auch
Binärdateien für z.B. Bilder oder Videos neu geladen werden. Wenn man
Binärdateien abspeichern möchte, dann benötigt man in der DB `acme` die beiden
Collections `fs.files` und `fs.chunks`, die man bei Bedarf z.B. mit _MongoDB
Compass_ innerhalb von `acme` neu anlegen kann.

Wenn man MongoDB mit _Atlas_ (s.u.) statt der lokalen Kubernetes- bzw.
Docker-Installation benutzen möchte, muss man in der Datei `.env` die
Konfigurationsdaten für Atlas eintragen und die jeweiligen Kommentare entfernen.
Es ist empfehlenswert, zuerst das Beispiel mit einer lokalen
MongoDB-Installation zum Laufen zu bringen, um die Fehlerquellen zu reduzieren.

### OpenAPI

Duch Decorators `@Api...()` kann man _OpenAPI_ (früher: Swagger) in den
Controller-Klassen und -Methoden konfigurieren und dann in einem Webbrowser mit
`https://localhost:3000/swagger` aufrufen. Die _Swagger JSON Datei_ kann man mit
`https://localhost:3000/swagger-json` aufrufen.

### Apollo Sandbox

Ab _Apollo 3_, das auch intern in Nest verwendet wird, gibt es _Apollo Sandbox_,
das man z.B. mit Chrome nutzen kann. Dabei empfiehlt es sich die
Chrome-Erweiterung _Apollo Client DevTools_ von
https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm
zu installieren. Apollo Sandbox kann man dann mit der URL
`https://studio.apollographql.com/sandbox/explorer` aufrufen.

Um effizient mit Apollo Sandbox zu arbeiten, empfiehlt es sich, dass man sich
dort registriert, damit man z.B. Autovervollständigen nutzen kann. Für das
Programmierbeispiel kann man beim Registrieren z.B. folgende Daten eingegeben:

- _Graph title_: `Buch`
- _Graph type_: `Development` angeklickt
- _Endpoint_: https://localhost:3000/graphql

Abschließend klickt man dann den Button _Create Graph_ an.

Beispielhafte _Queries_ und _Mutations_ für GraphQL gibt es in den Dateien
`extras\restclient\graphql\buch.query.http` und
`extras\restclient\graphql\buch.mutation.http`.

In der Sandbox kann man z.B. folgende Query absetzen:

...
{
  buch(id: "000000000000000000000001") {
    titel
    art
    isbn
    version
  }
}
...

Oder unter Verwendung von einer Variablen (hier: `buchId`):

...
query ($buchId: ID!) {
  buch(id: $buchId) {
    titel
    art
    isbn
    version
  }
}
...

Dazu muss man im unteren Abschnitt _Variables_ folgendes eintragen:

...
{
  "buchId": "000000000000000000000001"
}
...

Außerdem bietet Nest für eine GraphQL-Schnittstelle in einem Webbrowser die URL
`https://localhost:3000/graphql` an, mit der man auf _Playground_ zugreifen kann,
der allerdings ab _Apollo 3_ deprecated ist.

### REST Client für eine REST- und eine GraphQL-Schnittstelle

Im Unterverzeichnis `extras\restclient` befinden sich in den Unterverzeichnissen
`rest` und `graphql` mehrere Dateien mit der Extension `.rest` oder `.http`.
In diesen Dateien sind Interaktionsmöglichkeiten für die REST- und die
GraphQL-Schnittstelle.

Wenn man eine dieser Dateien in VS Code öffnet, dann sieht man bei jedem
Beispiel bzw. Abschnitt, der mit `###` beginnt, eine künstliche Zeile mit
_Send Request_ (keine Zeilennummer!). Auf _Send Request_ kann man klicken und
der Request wird ausgeführt, wozu natürlich der Server erfolgreich gestartet
sein sollte.

Für den REST-Client benötigt man unterschiedliche Umgebungen (_Environment_) je
nachdem, ob der Server lokal oder in einem (lokalen) Kubernetes-Cluster oder in
der Heroku-Cloud läuft. Verschiedene Umgebungen können prinzipiell die gleichen
Eigenschaften, aber mit verschiedenen Werten haben. Beispielsweise lautet die
URL für die REST-Schnittstelle beim lokalen Server `https://localhost:3000/...`
aber im Kubernetes-Cluster `http://localhost:3000/...`. Dazu kann man im
Unterverzeichnis `.vscode` die Datei `settings.json` bearbeiten.

Wenn man von nun an eine `.rest`-Datei öffnet, dann sieht man rechts unten in
der Statusleiste die aktuelle Umgebung. Sobald man rechts unten auf den Namen
der aktuellen Umgebung (oder _No Environment_) klickt, erscheinen die möglichen
Umgebungen in der Auswahl am oberen Fensterrand.

Wenn für die Interaktion mit dem Server Zugriffsberechtigungen erforderlich sind,
muss man sich zunächst einloggen und erhält dabei einen (Access-) Token, und
zwar einen _JWT_ (= JSON Web Token), so dass "stateless sessions" möglich sind.
Nach dem Einloggen kann man den JWT wiederholt verwenden, ohne jedes Mal den
Benutzernamen und vor allem das Passwort mitschicken zu müssen - bis zum
Ablaufen des Tokens. In der _Payload_ ("Nutzdaten") eines Tokens (siehe
https://jwt.io) sind Informationen zum jeweiligen User, so dass dessen Rollen
ermittelt werden können, um damit auf der Serverseite die Zugriffsberechtigungen
anhand der Rollen zu ermitteln (_RBAC_ = "Role-Based Access Controll").

```mermaid
stateDiagram
  state Gast
  state "JWT = JSON Web Token" as jwt
  state "REST-Schnittstelle" as rest
  state "GraphQL-Schnittstelle" as graphql
  state "RBAC = Role-Based Access Control" as rbac


  [*] --> Gast
  Gast --> jwt : Login, z.B. application/x-www-form-urlencoded
  jwt --> rest : HTTP-Header "Authorization"
  jwt --> graphql : HTTP-Header "Authorization"

  rest --> rbac : Authorisierung
  graphql --> rbac : Authorisierung

```

Für die Query-Sprache von GraphQL bietet der REST Client allerdings **KEIN**
Autovervollständigen an, wie man es von _Apollo Sandbox_ und _Playground_ (s.o.)
gewohnt ist.

### Postman

Als Alternative zu _REST Client_ als Plugin für VS Code kann man auch die
Desktop-Applikation _Postman_ nutzen: https://www.postman.com.

---

## Tests aufrufen

Folgende Voraussetzungen müssen oder sollten erfüllt sein:

- Der MongoDB-Server (lokal oder bei Atlas) muss gestartet sein.
- Port-Forwarding muss für MongoDB aktiviert sein, z.B. durch `skaffold dev`.
- Der Appserver muss _nicht gestartet_ sein.
- In `.env` sollte man die Umgebungsvariable `LOG_DEFAULT` auf `true` setzen,
  damit nur mit Log-Level `INFO` protokolliert wird, weil _Pino_ mit Log-Level
  `DEBUG` sonst evtl. nach dem Test-Ende noch protokolliert, was wiederum _Jest_
  als Fehler interpretiert.

Nun kann man die Tests folgendermaßen in einer Powershell aufrufen:

```PowerShell
    npm t
```

Bei der Fehlersuche ist es ratsam, nur eine einzelnen Testdatei aufzurufen,
z.B.:

```PowerShell
    npm exec jest --detectOpenHandles --errorOnDeprecated `
      --forceExit --runTestsByPath '__tests__\buch\buch-get.controller.test.ts'
```

## Docker-Image durch Buildpacks

Mittels _(Cloud Native) Buildpacks_ und der Konfigurationsdatei `project.toml`
kann man ein Docker Image erstellen, ohne dass ein Dockerfile erforderlich ist.
Das resultierende Image basiert auf _Ubuntu_ und erfordert, dass die
TypeScript-Dateien in JavaScript übersetzt sind. Durch das npm-Skript `pack`
wird das Docker-Image `docker.io/juergenzimmermann/buch:1.0.0` mit dem implizit
übersetzten JavaScript-Code gebaut:

```PowerShell
    # In der 2. PowerShell
    npm run pack
```

Wie das Docker-Image gebaut wurde, kann man anschließend mit folgendem Kommando
inspizieren:

```PowerShell
    pack inspect juergenzimmermann/buch:1.0.0
```

---

## Deployment in Kubernetes

### MongoDB als Voraussetzung

Voraussetzung für das Deployment des Microservice ist, dass der MongoDB-Server
erfolgreich gestartet ist (s.o.).

### Deployment mit kubectl und Kustomize

Im Verzeichnis `extras\kustomize\dev` ist eine Konfiguration für die Entwicklung
des Appservers. Wenn das Docker-Image erstellt ist (s.o.), kann das Deployment
in Kubernetes folgendermaßen durchgeführt werden, was man z.B. mit _Lens_ oder
 _Octant_ inspizieren kann. Dabei wird die Logdatei im internen Verzeichnis
`/var/log/node` angelegt, welches durch _Mounting_ dem Windows-Verzeichnis
`C:\Zimmermann\volumes\buch` entspricht und mit _Schreibberechtigung_ existieren
muss.

```PowerShell
    cd extras\kustomize\dev
    kustomize build | kubectl apply -f -
```

Das Deployment kann durch `kubectl` wieder aus Kubernetes entfernt werden:

```PowerShell
    kustomize build | kubectl delete -f -
```

### Continuous Deployment mit Skaffold

Um im Rahmen von _Continuous Deployment_ das Image mit dem Tag `1.0.0` zu bauen
und in Kubernetes zu deployen, muss die Umgebungsvariable `TAG` auf den Wert
`1.0.0` gesetzt werden. Weiterhin gibt es in Skaffold die Möglichkeit,
_Profile_ zu definieren, um z.B. verschiedene Overlays in Kustomize zu
verwenden. Dazu ist in skaffold.yaml beispielsweise konfiguriert, dass die
Umgebungsvariable `SKAFFOLD_PROFILE` auf `dev` gesetzt sein muss, um das
Kustomize-Overlay `dev` zu verwenden.

Continuous Deployment mit Beobachtung von Code-Änderungen wird mit Skaffold
folgendermaßen durchgeführt und kann mit `<Strg>C` abgebrochen bzw.
zurückgerollt werden.  Bis das Port-Forwarding, das in `skaffold.yaml`
konfiguriert ist, auch ausgeführt wird, muss man ggf. ein bisschen warten.

```PowerShell
    $env:TAG = '1.0.0'
    skaffold dev
```

---

## Codeanalyse durch ESLint und SonarQube

_ESLint_ wird durch folgendes npm-Skript ausgeführt:

```PowerShell
    npm run eslint
```

Für eine statische Codeanalyse durch _SonarQube_ muss zunächst der
SonarQube-Server mit _Docker Compose V2_ als Docker-Container gestartet werden.
Docker Compose V2 ist eine Neuimplementierung in Go statt in Python und ist
selbst ein Plugin für Docker. Als Konfigurationsdatei wird dabei `sonar.yaml`
verwendet:

```PowerShell
    docker compose -f sonar.yaml up
```

Wenn der Server zum ersten Mal gestartet wird, ruft man in einem Webbrowser die
URL `http://localhost:9000` auf. In der Startseite muss man sich einloggen und
verwendet dazu als Loginname `admin` und ebenso als Password `admin`. Danach
wird man weitergeleitet, um das initiale Passwort zu ändern. Den Loginnamen und
das neue Passwort trägt man dann in der Datei `sonar-project.properties` im
Wurzelverzeichnis bei den Properties `sonar.login` und `sonar.password` ein.

Nachdem der Server gestartet ist, wird der SonarQube-Scanner in einer zweiten
PowerShell ebenfalls mit _Docker Compose V2_ gestartet, wozu dieselbe
Konfigurationsdatei mit dem Profile `scan` verwendet wird. Der Scan-Vorgang kann
evtl. **lange** dauern. Abschließend wird der oben gestartete Server
heruntergefahren.

```PowerShell
    docker compose -f sonar.yaml --profile scan up
    docker compose -f sonar.yaml down
```

---

## Sicherheitsanalyse durch snyk

Zunächst muss man sich bei https://app.snyk.io/account registrieren und dort
auch einen Token besorgen. Danach kann man sich folgendermaßen authentifizieren
und das Projekt auf Sicherheitslücken überprüfen

```PowerShell
    synk auth <MEIN_TOKEN>
    snyk test
```

## AsciiDoctor und PlantUML

Mit AsciiDoctor und PlantUML ist die Dokumentation geschrieben.

### Preview von PlantUML-Dateien

Durch das Tastaturkürzel `<Alt>d`. Dazu ist eine Internet-Verbindung notwendig.
Beispiele für PlantUML und AsciiDoctor sind im Unterverzeichnis `extras\doc`.

### Einstellungen für Preview von AsciiDoctor-Dateien

Zunächst müssen einmalig die Einstellungen (_Settings_) von VS Code geändert
werden. Dazu geht man über zum Menüpunkt _Datei > Einstellungen > Einstellungen_
und gibt im Suchfeld `asciidoc.use_kroki` ein. Nun setzt man den Haken bei
_Enable kroki integration to generate diagrams_.

Wenn man zum ersten Mal eine `.adoc`-Datei im Editor öffnet, muss man noch
die Verbindung zum PlantUML-Server zulassen, damit die eingebundenen
`.puml`-Dateien in `.svg`-Dateien konvertiert werden. Dazu gibt man zunächst
das `<F1>` ein und schickt im Eingabefeld das Kommando
_AsciiDoc: Change Preview Security Settings_ durch `<Enter>` ab.
Danach wählt man den Unterpunkt _Allow insecure content_ aus.

### Preview von AsciiDoctor-Dateien

Durch das Tastaturkürzel `<Strg><Shift>v`. Dazu ist eine Internet-Verbindung
notwendig.

### Dokumentation im Format HTML

Die Dokumentation im Format HTML wird in einer Powershell folgendermaßen
im Verzeichnis `extras\doc\html` erstellt:

```PowerShell
    npm run asciidoc
```

## Continuous Integration mit Jenkins

Jenkins wird nicht in Kubernetes, sondern direkt mit _Docker Compose V2_
genutzt. Dadurch muss Jenkins nicht immer laufen und kann bei Bedarf gestartet
und wieder heruntergefahren werden. Docker Compose V2 ist eine
Neuimplementierung in Go statt in Python und ist selbst ein Plugin für Docker.
Als Konfigurationsdatei wird `jenkins.yaml` verwendet.

```PowerShell
    docker compose -f jenkins.yaml up
    ...
    # In einer 2. PowerShell
    docker compose -f jenkins.yaml down
```

### Aufruf mit Webbrowser

Mit der URL https://localhost:9090 kann man von einem Webbrowser auf das
Jenkins-Image zugreifen. Der Benutzername ist `admin` und das Passwort
`Software Engineering WI.`.

### Bash zur evtl. Fehlersuche im laufenden Jenkins-Container

```PowerShell
    docker compose -f jenkins.yaml exec jenkins bash
```

## Monitoring durch clinic

Für Monitoring kann man z.B. `clinic` nutzen, indem man zunächst dem TypeScript-Compiler
durch `npm run tsc` aufruft und danach `npm run clinic`.

Allerdings gibt es noch das offene Ticket
https://github.com/clinicjs/node-clinic-doctor/issues/304

## Visual Studio Code oder WebStorm als Entwicklungsumgebung

[Visual Studio Code](https://code.visualstudio.com/Download) kann man
kostenfrei herunterladen.

> Tipps:
>
> - `<Strg>kc` : Markierte Zeilen werden auskommentiert (wie bei Visual Studio)
> - `<Strg>ku` : Bei markierten Zeilen wird der Kommentar entfernt
> - `<F1>`: Die Kommandopalette erscheint
> - `<Strg><Shift>v`: Vorschau für MarkDown und AsciiDoctor
> - `<Alt>d`: Vorschau für PlantUml

Für WebStorm gibt es bei [JetBrains](http://jetbrains.com/student) auf
Initiative von Jürgen Zimmermann eine Studenten-Lizenz, die für 1 Jahr gültig
ist.

## Atlas

### Atlas von MongoDB

Atlas ist vom Unternehmen [MongoDB, Inc.](https://www.mongodb.com/cloud/atlas)
und bietet _Database as a Service_. Als zugrundeliegende Infrastruktur kann
zwischen _AWS_ (Amazon Web Services), _Microsoft Azure_ und
_GCP_ (= Google Cloud Platform) gewählt werden.

Atlas ist ursprünglich von Unternehmen _mLab_, das 2018 von MongoDB, Inc.
übernommen wurde.

### Registrierung bei Atlas

Zu Beginn muss man sich unter https://cloud.mongodb.com registrieren und
füllt das Registrierungsformular mit Emailadresse (als künftiger _Username_),
Passwort und "Company Name" (als zukünftige _Organization_) aus.

### Einloggen

Bei https://cloud.mongodb.com kann man sich jetzt mit der mit der
_Emailadresse_ als _Username_ einloggen.

### Projekt erstellen

Nachdem man sich eingeloggt hat und unterhalb von _Organization_ den Menüpunkt
_Projects_ ausgewählt hat, erstellt man ein Projekt, indem der Button
_New Project_ angeklickt wird. Für das Projekt muss man einen Namen angeben.
Der Projektname ist nur für Verwaltungszwecke und hat keine Auswirkungen auf
die spätere "Connection URL" der DB.
Man kann auch weitere "Member" mit ihrer Emailadresse hinzufügen, was aber
nicht erforderlich ist.

Mit dem Button _Create Project_ wird das Projekt nun angelegt.

### Cluster erstellen

Nachdem das Projekt erstellt ist, wird ein Cluster angelegt, indem man auf den
Button _Build a Cluster_ klickt. Nun kann man durch den Button
_Create a Cluster_ unterhalb von "Shared Clusters" einen kostenlosen Cluster
anlegen.

Danach wählt man den "Provider", z.B. _aws_ (Amazon Web Services), und die
"Region", z.B. Frankfurt, aus. Durch den Button _Create Cluster_ wird der
kostenlose Cluster mit dem Namen `Cluster0` schließlich angelegt, was einige
Minuten dauern kann.

### DB-Benutzer erstellen

Jetzt wählt man das Untermenü _SECURITY > Database Access_ aus, um einen
DB-Benutzer zu erstellen. Dort klickt man auf den Button _Add New Database User.

Im Formular füllt man die beiden Felder für "Username" und "Password" aus.
Danach schickt man mit dem Button _Add User_ das Formular ab und wartet,
bis die Statusmeldung "We are deploying your changes" verschwunden ist.

### Zulässige IP-Adressen für die DB-Clients

Jetzt wählt man das Untermenü _SECURITY > Network Access_ aus, um zu
konfigurieren, welche IP-Adressen für die DB-Clients zulässig sein sollen
("Whitelist"). Dazu klickt man auf den Button _Add IP Address_.
Nun klickt man unächst den Button _Allow Access from anywhere_ und danach den
Button _Confirm_.

Das vereinfacht den Zugang von einer Cloud, wie z.B. _Heroku_ oder  _OpenShift_
sowie bei dynamischen IP-Adressen in einem öffentlichen WLAN.

### URL für künftige DB-Verbindungen

Jetzt wählt man das Untermenü _DATA STORAGE > Clusters_ aus, um die URL
für künftige DB-Verbindungen zu erhalten. Dazu klickt man zunächst auf den
Button _Connect_ und dann auf den Menüpunkt _Connect Your Application_.
Nun kann man auf den Button _Copy_ klicken und hat die URL im "Copy Buffer",
so dass man die URL mit `<Strg>v` kopieren bzw. sichern kann. Die URL sieht
im Prinzip so aus:

```text
    mongodb+srv://...:<password>@cluster0-?????.mongodb.net/test?retryWrites=true&w=majority
```

_CAVEAT_: Das eigene Passwort wird aus Sicherheitsgründen nicht angezeigt,
sondern der Platzhalter `<password>`. Diesen Platzhalter muss man natürlich
ersetzen, wenn man die URL im eigenen Appserver (als DB-Client) nutzt.

### Ausloggen bei Atlas

Rechts oben kann man sich über den Menüpunkt _Sign Out_ ausloggen.

### Datenbank acme erstellen

Um nicht die DB `test` (s.o. in der URL) im künftigen Appserver zu benutzen,
erstellt man in einer Powershell mit der Mongo CLI eine eigene DB (z.B. `acme`)
mit einer leeren Collection (z.B. `Buch`):

```text
    mongo "mongodb+srv://<<MEINE_KENNUNG>>:<<MEIN_PASSWORT_>>@cluster0-....mongodb.net/test?w=majority"
        use acme
        db.createCollection('Buch')
        exit
```

Bei einer DB-URL ist `retryWrites=true` der Default-Wert und kann deshalb
weggelassen werden.

### DB-Browser für Atlas

In Compass (oder im Plugin MongoDB for VS Code) muss man für Atlas bei den
Verbindungseinstellungen folgende Werte in den Eingabefeldern eingeben bzw.
auswählen:

| Eingabefeld        | Wert                                        |
|--------------------|---------------------------------------------|
| _Hostname_         | `cluster0-?????.mongodb.net`                |
| _Authentication_   | `Username / Password` statt `SCRAM-SHA-256` |
| _Replica Set Name_ | `Cluster0-shard-0`                          |
| _SSL_              | `System CA / Atlas Deployment`              |

Wenn man in einem Webbrowser bei https://cloud.mongodb.com eingeloggt ist, kann
man auch über den Menüpunkt _Databases_ am linken Rand auf _Cluster0_ unterhalb
von "Database Deployments" klicken und danach in der Überschriftsleiste den
Punkt _Collections_ auswählen. Nun kann man die eigene(n) Collection(s) und
Indexe im Webbrowser inspizieren.

## Heroku

### Heroku von Salesforce

_Heroku_ ist eine Cloud-Plattform und funktioniert als PaaS
(= Plattform as a Service), so dass man eine Programmier- und Laufzeitumgebung
in der Cloud hat: https://www.heroku.com/platform. Heroku wird seit 2007
entwickelt und wurde 2010 vom CRM-Anbieter
[Salesforce](https://www.salesforce.com/de/products/platform/products/heroku/)
übernommen.

Mit Heroku lassen sich Anwendungen für z.B. _Node_ oder _Java_ entwickeln.
Als Datenbank kann man z.B. _PostgreSQL_ oder _MongoDB_ verwenden.
Das Deployment erfolgt auf der Basis von _Git_ (s.u.).

### dyno, slug und buildpack

Heroku-Anwendungen laufen in mehreren leichtgewichtigen _Containern_, die
_dyno_ heißen. Ein _Web dyno_ wird in der Datei `Procfile` mit dem Prozess-Typ
_web_ deklariert. Nur Web dynos können HTTP-Requests empfangen und -Responses
senden.

Nachdem die eigene Anwendung gepackt und komprimiert ist, wird sie als _slug_
bezeichnet. Ein _slug_ kann danach in einem _dyno_ ausgeführt werden.
Die maximale Größe für ein _slug_ beträgt 500 MB.

Mit Hilfe von einem _buildpack_ wird die eigene Anwendung zu einem _slug_
transformiert. Dazu benötigt Heroku diverse Skripte, die von der jeweiligen
Programmiersprache, z.B. JavaScript oder Java, abhängen. Mit diesen Skripten
wird z.B. die Fremdsoftware (_dependencies_) geladen, die man innerhalb der
eigenen Anwendung nutzt, und es wird ggf. der Compiler aufgerufen.

Wenn es im Wurzelverzeichnis eine Datei `package.json` gibt, verwendet Heroku
das _Node.js buildpack_ und ergänzt seine Umgebungsvariable `PATH` um die Pfade
für `node`, `npm` und `node_modules/.bin`.

### Registrierung bei Heroku

Zu Beginn muss man sich bei https://signup.heroku.com registrieren, indem man
das Formular ausfüllt, mit dem Button _CREATE FREE ACCOUNT_ abschickt und
abschließend den Link in der Bestätigungsemail anklickt.

### Einmalig: Git-Repository erstellen

In VS Code sind folgende Einstellungen empfehlenswert, nachdem man das
Beispielprojekt in VS Code geöffnet hat, indem man VS Code startet und über
_Datei_ und den Unterpunkt _Ordner öffnen_ das Verzeichnis mit dem
Beispielprojekt geöffnet hat. Jetzt kann man über _Datei_, den Unterpunkt
_Einstellungen_ und nochmals _Einstellungen_ im Eingabefeld `Git` eingeben.
Nun sieht man die Konfigurationsmöglichkeiten für Git und setzt die Haken bei
`Git: Enable Smart Commit` und bei `Git: Suggest Smart Commit`.

Jetzt klickt man auf das Icon _Quellcodeverwaltung_ am linken Rand und
anschließend auf den Button `Repository initialisieren`.

Man bleibt in der _Quellcodeverwaltung_ und sieht nun viele Dateien markiert mit
`U` (ncommitted). Im Eingabefeld steht der Hinweis _Nachricht_, wo man z.B.
`Initiale` Version eingibt und dann auf den Haken (Tooltipp: _Commit_) klickt.

### Einloggen und Token erstellen mit der Heroku CLI

Mit dem Tastaturkürzel `<F1>` öffnet man die Kommandopalette.
Dort gibt man `heroku login` ein und über das nun geöffnete Powershell-Terminal
wird der Webbrowser mit der Login-URL für Heroku gestartet, so dass man sich
dort einloggen kann, wozu man die Emailadresse und das Passwort von der
zuvor erfolgten Registrierung verwendet.

Nach dem erfolgreichen Einloggen gibt es zur Verwaltung das Verzeichnis
`C:\Users\<MEINE_KENNUNG>\AppData\Local\heroku`.

### Leere Anwendung für Heroku erstellen

Durch `<F1>` kann man in der Kommandopalette `heroku create` eingeben.
Die Ausgabe im Powershell-Terminal sieht dann prinzipiell folgendermaßen aus:

```text
https://gener-iert-12345.herokuapp.com/ | https://git.heroku.com/gener-iert-12345-53594.git
```

Jetzt gibt es also eine generierte Domain für die eigene Anwendung, die künftig
über z.B. https://gener-iert-12345.herokuapp.com/ erreichbar sein wird.

Die ausgegebene URL nimmt man, um in _package.json_ innerhalb von `"scripts": {`
die dortige URL `https://gener-iert-12345.herokuapp.com/` bei den Skripten
`heroku:curl` und `heroku:open` zu überschreiben.

### Umgebungsvariable für Heroku

Mit der Kommandopalette durch `<F1>` gibt man `heroku config:set` und
anschließend prinzipiell `DB_HOST=cluster0-?????.mongodb.net`, wobei die ?
gemäß der obigen Atlas-Konfiguration ersetzt werden müssen. Dabei kann man im
Powershell-Terminal die Interaktion mit Heroku verfolgen.

Das wiederholt man dann noch für die Umgebungsvariable mit den passenden
Werten für Benutzername und Passwort aus der Atlas-Konfiguration:

- NODE_ENV=development
- DB_HOST=cluster0.?????.mongodb.net nicht nochmal!!!
- DB_USER=?????
- DB_PASS=?????
- DB_AUTO_INDEX=true
- DB_POPULATE=true
- DB_POPULATE_FILES=true
- APOLLO_DEBUG=true
- APOLLO_SANDBOX=false
- LOG_DIR=/tmp
- LOG_LEVEL_CONSOLE=debug
- LOG_PRETTY=true
- USER_PASSWORD_ENCODED=$argon2i$v=19$m=4096,t=3,p=1$aaxA2v/9rRSPGkwYN+NQog$27Huii1XtD3iEd62fog+04G26LRPZMHoYCI6AGKTL8M // das was jakob geschickt hat

### Deployment für Heroku

Für das erstmalige Deployment und nach künftigen Codeänderungen gibt man
in der Kommandopalette (durch `<F1>`) das Kommando `git push heroku main`
für den eigenen _main-Branch_ im Git-Repository ein.

Dadurch wird in Heroku ein _slug_ erstellt: die Anwendung wird gepackt und
komprimiert, so dass sie einschließend in einem _dyno_ (leichtgewichtiger
Linux-Container) ablaufen kann. Im PowerShell-Terminal kann man dabei den Ablauf
mitverfolgen.

```mermaid
stateDiagram
  [*] --> Sources : git push heroku main
  Sources --> Buildsystem
  state Buildsystem {
    [*] --> Buildpack
    Buildpack --> Runtime
    Runtime --> Dependencies
    Dependencies --> slug
  }
  Buildsystem --> dyno
```

Nur die in Git versionierten Dateien werden für das Deployment verwendet,
weshalb nur die TypeScript-Dateien zu Heroku hochgeladen werden, die dann dort
zu lauffähigen JavaScript-Dateien übersetzt werden müssen. Dazu gibt es das
npm-Skript `heroku-postbuild`, das innerhalb von Heroku aufgerufen wird und
nicht manuell aufgerufen werden muss.

Beim das Deployment werden die NPM-Packages aus dem Verzeichnis `node_modules`
immer wieder benötigt. Deshalb nimmt Heroku defaultmäßig ein Caching von
`node_modules` vor.

Nach einem erfolgreichen Deployment sollte man (als Student/in) die
Heroku-Anwendung durch das Kommando `heroku ps:scale web=1` so skalieren, dass
sie nur _1_ Web dyno nutzt. Analog kann man durch `heroku ps:scale web=0` die
eigene Anwendung deaktieren.

Durch das Kommando `heroku buildpacks` kann man sich auflisten lassen, welche
buildpacks beim Erstellen von einem slug verwendet werden.

### Status-Informationen zu Heroku

Mit `heroku ps` kann man sich anzeigen lassen, wieviele freie "Dyno-Stunden"
man im aktuellen Monat noch hat und wieviele bereits verbraucht sind.
Persönliche Accounts verfügen monatlich über 550 freie "Dyno-Stunden":
https://devcenter.heroku.com/articles/free-dyno-hours.

### Verfügbarkeit der eigenen Heroku-Anwendung

Nach dem Deployment ist die eigene Anwendung verfügbar und kann benutzt
werden. Beispielsweise kann man in einer eigenen Powershell das Kommando
`npm run heroku:curl` aufrufen. Dabei wird mit `curl` auf die URL
`https://gener-iert-12345.herokuapp.com/api/000000000000000000000001`
zugegriffen.

Alternativ kann man auch `npm run heroku:browser` oder `npm run heroku:browser:file`
aufrufen, dann wird der Response in einem Webbrowser angezeigt.

### Heroku-Console

Mit der Kommandopalette durch `<F1>` kann man
`heroku logs --tail --app gener-iert-12345` eingeben und die Logging-Ausgaben
auf der Heroku-Console mitverfolgen, ähnlich wie bei Linux mit `tail -f`.

### Dashboard für die Verwaltung der eigenen Heroku-Anwendung(en)

Unter https://dashboard.heroku.com kann man die eigene Anwendung verwalten.

Wenn man dort die eigene Anwendung selektiert bzw. anklickt, kann man z.B. über
den Karteireiter _Settings_ eine Anwendung vom Netz nehmen, indem man den
_Maintenance Mode_ einschaltet (am Seitenende). Auch kann man dort die
Anwendung ggf. löschen.

### Sonstige Heroku-Kommandos

Mit `heroku run ...` kann man ein einzelnes Kommando als REPL
(= Read-eval-print loop) laufen lassen. So zeigt z.B. das Kommando
`heroku run --app gener-iert-12345 node --version` an, welche Node-Version für
die Heroku-Anwendung verwendet wird.
Oder mit `heroku run --app gener-iert-12345 printenv` kann man sich die
Umgebungsvariable für die Heroku-Anwendung anzeigen lassen.

Mit `heroku addons` kann man sich zusätzlich installierte Add-ons anzeigen
lassen. Beispielsweise könnte man das Add-on _mLab MongoDB_ statt _Atlas_
verwenden.

## Empfohlene Code-Konventionen

In Anlehnung an die
[Guidelines von TypeScript](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)

- "Feature Filenames", z.B. buch.service.ts
- Klassennamen und Enums mit PascalCase
- Attribute und Funktionen mit camelCase
- private Properties _nicht_ mit vorangestelltem **\_**
- Interfaces _nicht_ mit vorangestelltem **I**
- _Barrel_ für häufige Imports, z.B.
  - `config\index.ts` erstellen:

```javascript
    export * from './bar';
    export * from './foo';
```

- einfaches Importieren:

```javascript
    import { Bar, Foo } from 'config';
```

- [...].`forEach`(), [...].`filter`() und [...].`map`() statt for-Schleife
- Arrow-Functions statt function()
- `undefined` verwenden und nicht `null`
- Geschweifte Klammern bei if-Anweisungen
- Maximale Dateigröße: 400 Zeilen
- Maximale Funktionsgröße: 75 Zeilen
