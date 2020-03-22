![Azure DevOps builds](https://img.shields.io/azure-devops/build/jannikb/wir-vs-corona/43)

Live version: https://corona-helden-app-prod.azurewebsites.net/


# WirVsVirus Rekrutierung von mehr- und weniger qualifizierten Helfern im Medizin- und Pflegebereich



# Erste Schritte

**Node** installieren: https://nodejs.org/en/

**.NET Core SDK v2.2** (nicht die aktuellste)  installieren: https://dotnet.microsoft.com/download


**Git** https://git-scm.com/downloads/guis

Also Editor für das Frontend bietet sich **Visual Studio Code** https://code.visualstudio.com/ an. Als Editor für das Backend bietet sich **Visual Studio** https://visualstudio.microsoft.com/ an (VS Code geht auch).
Prinzipiell gehen auch alle anderen Texteditoren um Dateien zu editieren.


Ein Terminal und Repository clonen:

```
git clone https://github.com/wir-vs-virus-my-contribution/my-contribution.git
```

Frontend Dependencies installieren und Frontendprojekt starten:
```
cd app/web
npm install
npm run start
```

Backendprojekt starten:
Backend Projekt `app.sln` in Visual Studio öffnen und Debugger starten / F5 drücken oder in einem Terminal:

```
cd app
dotnet watch run
```

Frontend Projekt mit VS Code öffnen: client.code-workspace

Browser öffnen um Backend aufzurufen https://localhost:5001/ (liefert Frontend aus)
oder http://localhost:3000 (Frontend only)
