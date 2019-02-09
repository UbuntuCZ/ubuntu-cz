
# Ubuntu.cz

[![Build Status](https://api.travis-ci.com/UbuntuCZ/ubuntu-cz.svg?branch=master)](https://travis-ci.com/UbuntuCZ/ubuntu-cz)

Repositář pro web Ubuntu.cz. Autorem jeho vzhledu, obsahu a původní verze (jako *iUbuntu.cz*) v PHP je [Martin Kozub](https://github.com/zubozrout). O přepis do statického generátoru [Jekyll](https://jekyllrb.com/) se postaral [Michal Stanke](https://github.com/MikkCZ/).

## Úpravy obsahu

### Šablona
Soubory tvořící základní HTML šablonu se nachází v adresářích `_includes` a `_layouts`, styly v adresáři `design`.

### Obsah
Obsah všech stránek je v adresáři `_pages` a je psaný v HTML. Použité obrázky jsou nahraní v adresáři `images`.

### Příprava
Abyste byli schopni spustit níže uvedené příkazy, je nutné mít nainstalovaný [Ruby](https://www.ruby-lang.org/en/documentation/installation/) a [Bundler](https://bundler.io/#getting-started).

Před prvním zobrazením (nebo po změně souboru `Gemfile`) je potřeba stáhnout potřebné závislosti.
```
$ bundle install --path vendor/bundle
```

### Náhled
Při úpravách vzhledu i obsahu je dobré rovnou se podívat na výsledek. Níže uvedený příkaz sestaví obsah repositáře a zpřístupní ho na lokální adrese http://localhost:4000/.
```
$ bundle exec jekyll serve
```
Příkaz stačí spustit jednou v samostatném terminálu a nechat běžet. Pokud pak ve zdrojových souborech provedete nějakou změnu, Jekyll sestaví stránky znovu. Pro zobrazení efektu změn stačí obnovit načtenou stránku v prohlížeči (*F5*).

## Sestavení statické verze
Pro sestavení webu slouží tento příkaz.
```
$ bundle exec jekyll build
```
Statická verze stránek je vygenerovaná do adresáře `_site`. Pro nasazení stačí jeho obsah nahrát na server třeba přes FTP.
