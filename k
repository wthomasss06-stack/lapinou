git add .
git commit -m "chez florence text"
git push

node scripts/upload-images-to-cloudinary.js


Petit à-côté que j'ai remarqué en cherchant le footer : HomeClient.tsx (804 lignes) n'est importé nulle part dans le projet — c'est du code mort, remplacé par page.tsx + les sections séparées. Je n'y touche pas sans ton feu vert, mais ça vaut le coup de le supprimer un jour pour alléger le repo. fais une verif apres tu fais uun script tous deplacer les fichier inutiliser vers un dossier "ca degage" je vais les garder mais  garde iris pour aleger le repo 