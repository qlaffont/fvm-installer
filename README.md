FiveM Installer
--------------
FiveM Installer is a package for FiveM Server (FX). This scripts download resources to build your server.
Is not longer maintained by me but by the community.
**La version française est en bas de la page.**

Compatible resources list: https://github.com/qlaffont/fvm-installer-list/blob/master/README.md

Liste des ressources compatible: https://github.com/qlaffont/fvm-installer-list/blob/master/README.md

Installation
--------------

```sh
npm install -g fvm-installer
```

Options
--------------
> --save
> You can use *--save* option for (install/update/delete) to save installed script in scripts.json

> --folder=<folder_name>
> You can use *--folder* option for (install) to save installed script in dedicated folder.


Usage
--------------
> **You need to be in FX Server Folder and have downloaded resources/ folder (or create one)**
> **Package name format is : "user/repo. Example: fivemtools/ft_ui. All packages need to come from Github.**



Initialise FiveM Installer Folder :

```sh
λ fvm init

Initialisation of FiveM Installer directory !


Name: Sample FiveM Server
Author: Quentin Laffont
Website: https://qlaffont.com


Initialisation of FiveM Installer directory finish ! You can now use fvm installer.
```


Install one or more packages in resources :

*You can specify a version with resource_name@number. (Example: fivemtools/ft_ui@0.1)*

You can specify a folder where your script can be saved with *--folder* option. (Example, here we register our script in resources/[ft]/ft_ui: fvm install fivemtools/ft_ui --save --folder=ft)

```sh
λ fvm install fivemtools/ft_ui

Installing ft_ui - 0.1
https://api.github.com/repos/FivemTools/ft_ui/zipball/0.1

Installation Successful !
```


Have list of all packages can be upgraded :

```sh
λ fvm update

This package can be upgraded:

fivemtools/ft_ui        Installed: 0.1

To upgrade packages, do fvm update <package_name>

```


Upgrade package to last version

```sh
λ fvm update fivemtools/ft_ui

Updating ft_ui - 0.1 -> 0.1
https://api.github.com/repos/FivemTools/ft_ui/zipball/0.1


Update Successful !

```


Remove package

```sh
λ fvm remove fivemtools/ft_ui

Delete Successful of fivemtools/ft_ui

```





--------------------

FiveM Installer
--------------
FiveM Installer est un utilitaire pour pouvoir télécharger des scripts de FiveM pour un serveur FX.
Le projet n'est plus maintenu par moi mais par la communauté.

Installation
--------------

```sh
npm install -g fvm-installer
```

Options
--------------
> --save
> Tu peux utiliser *--save* pour pouvoir avoir un fichier de configuration nommé scripts.json avec tous les scripts installés (installation/mis à jour/suppression).

> --folder=<folder_name>
> Te permet d'installer ton script dans un dossier dédié (installation).


Usage
--------------
> **Tu doit être dans un dossier FX Server contenant le dossier resources (sinon il faut l'ajouter)**
> **Format du package : "utilisateur/repository. Exemple: fivemtools/ft_ui. Les packages doivent venir de Github**



Initialiser le dossier FiveM Installer :

```sh
λ fvm init

Initialisation of FiveM Installer directory !


Name: Sample FiveM Server
Author: Quentin Laffont
Website: https://qlaffont.com


Initialisation of FiveM Installer directory finish ! You can now use fvm installer.
```


Installer une ou plusieurs ressources :
*Tu peux spécifier la version avec nom_ressource@numéro_de_version. (Exemple: fivemtools/ft_ui@0.1)*

Tu peux spécifier où le script peux être installer avec l'option *--folder*. (Exemple, ici on enregistre le script dans resources/[ft]/ft_ui:  fvm install fivemtools/ft_ui --save --folder=ft)

```sh
λ fvm install fivemtools/ft_ui

Installing ft_ui - 0.1
https://api.github.com/repos/FivemTools/ft_ui/zipball/0.1

Installation Successful !
```


Liste des ressources à mettre à jour :

```sh
λ fvm update

This package can be upgraded:

fivemtools/ft_ui        Installed: 0.1

To upgrade packages, do fvm update <package_name>

```


Mettre à jour à la dernière version :

```sh
λ fvm update fivemtools/ft_ui

Updating ft_ui - 0.1 -> 0.1
https://api.github.com/repos/FivemTools/ft_ui/zipball/0.1


Update Successful !

```


Supprimer une ressource

```sh
λ fvm remove fivemtools/ft_ui

Delete Successful of fivemtools/ft_ui

```
