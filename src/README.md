# YouScrap
## Projet nodejs - Ynov B2

Authors:
- Antoine Chiny github.com/tonychg
- Julien Dauliac github.com/dauliac

**youscrap** est un CLI qui récupére une page html en prenant en paramètre une url, il extrait les liens apparteneant au même domaine et les retourne à l'utilisateur. **youscrap** utilise ```curl``` pour executer les requêtes http.
Plusieurs options d'affichage sont disponibles.

**Important**: **youscrap** ne fonctionne que sur les sites statiques.

# Prerequis

- curl >= 7.59.0
- nodejs >= 10.0.0

# Installation

```
git clone https://github.com/TonyChG/youscrap.git
npm i -g
```

# Usage

```
> youscrap -u http://github.com
```

## Options
- ```-v, --verbose```  
Valeur par défaut: false
Affiche les requêtes envoyées en temps réel.

- ```-t, --tree```  
Valeur par défaut: false
Affiche les liens sous forme d'arbre

- ```-c, --colors```  
Valeur par défaut: false
Affiche les couleurs

- ```-d, --depth```  
Valeur par défaut: 1
Nombre d'itérations, pour chaque liens de chaque page.
Attention avec cette option on peut vite se retrouver avec beaucoup trop de lien à scrap.

- ```-f, --file [file]```  
Ecris les logs dans un fichier.

## Examples

```
> youscrap -u http://github.com -d 2 -tv
```
Suis chaque lien de la page github.com et affiche tout les liens récupérés sous forme d'arbre.

```
> youscrap -u http://materiel.net
```
Affiche tout les hrefs de la page principale du site materiel.net

