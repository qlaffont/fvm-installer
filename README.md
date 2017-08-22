FiveM Installer
--------------
FiveM Installer is a package for FiveM Server (FX). This scripts download resources to build your server.

Installation
--------------

```sh
npm install -g fvm-installer
```

Options
--------------
> --save
> You can use *--save* option for (install/update/delete) to save installed script in scripts.json 


Usage
--------------
> **You need to be in FX Server Folder and have downloaded resources/ folder (or create one)**
> **Package name format is : "user/repo. Exemple: fivemtools/ft_ui. All packages need to come from Github.**



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
