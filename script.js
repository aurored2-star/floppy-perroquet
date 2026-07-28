// ============================================================
// FLOPPY PERROQUET — script.js commentaire 
// ligne par ligne
// ============================================================

// On récupère l'élément <canvas> du HTML grâce à son id="canvas"
const canvas = document.getElementById("canvas");
// ctx = context, getContext = retourne un contexte de dessin sur le canevas
// C'est cet objet "ctx" qui va nous servir à TOUT dessiner (image, texte, formes) getContext("2d") = on veut un contexte en 2 dimensions (pas 3D) + c'est une méthode du canvas qui renvoie un objet de type CanvasRenderingContext2D
const ctx = canvas.getContext("2d");

// Set d'image : on crée un objet Image, vide pour l'instant
const img = new Image();
// Source de cette image : on indique le chemin du fichier à charger.
// Ce fichier contient TOUTES les images du jeu réunies (spritesheet) :
// l'oiseau, le décor, les tuyaux — on va découper dedans plus tard.
img.src = "/media/flappy-bird-set.png";

// ============================================================
// Reglages generaux
// (des constantes : ces valeurs ne changeront jamais pendant le jeu)
// ============================================================

// Etat du jeu : false = écran d'accueil, true = partie en cours
let gamePlaying = false;

// Force qui tire l'oiseau vers le bas, appliquée à chaque image
const gravity = 0.5;

// Vitesse des poteaux lorsqu'ils arrivent (et vitesse de défilement du décor)
const speed = 6.2;

// Taille de l'oiseau en pixels : [largeur, hauteur]
const size = [60, 36];

// Saut de l'oiseau : valeur NEGATIVE car sur un canvas l'axe Y est inversé
// (0 en haut de l'écran, les valeurs augmentent vers le bas)
// donc "négatif" = "vers le haut"
const jump = -11.5;

// Position horizontale FIXE de l'oiseau : toujours à 1/10 de la largeur du canvas.
// L'oiseau ne bouge jamais horizontalement, c'est le décor qui vient à lui.
const cTenth = canvas.width / 10;

// ============================================================
// Pipe settings (réglages des tuyaux)
// ============================================================

// Largeur d'un tuyau en pixels
const pipeWidth = 78;

// Hauteur de l'ouverture entre le tuyau du haut et celui du bas
const pipeGap = 300;

// Fonction qui calcule une hauteur ALEATOIRE pour l'ouverture d'un tuyau.
// Math.random() renvoie un nombre entre 0 et 1, qu'on multiplie et décale
// pour que l'ouverture ne sorte jamais de l'écran (ni trop haut, ni trop bas). 
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
  pipeWidth;

// ============================================================
// Variables d'état : contrairement aux constantes ci-dessus,
// celles-ci VONT CHANGER en permanence pendant que le jeu tourne
// ============================================================

// Création de l'effet paralax
let index = 0,       // compteur d'images écoulées depuis le début (sert à l'animation)
  bestScore = 0,      // meilleur score jamais atteint
  currentScore = 0,   // score de la partie en cours
  pipes = [],         // tableau contenant les tuyaux actuellement à l'écran
  flight,             // vitesse verticale actuelle de l'oiseau (sera définie dans setup())
  flyHeight;          // position verticale actuelle de l'oiseau (sera définie dans setup())

// ============================================================
// setup() : fonction de (ré)initialisation du jeu.
// Appelée au tout début, puis à chaque game over.
// ============================================================
const setup = () => {
  currentScore = 0; // on remet le score de la partie à zéro

  flight = jump; // on redonne à l'oiseau sa vitesse de départ (celle du saut)

  // on repositionne l'oiseau au centre vertical du canvas
  flyHeight = canvas.height / 2 - size[1] / 2;

  // Il faut créer un array de 3 poteaux. Car il doit y avoir tjr 3 poteaux dans l'ecran.
  // Array(3) crée un tableau de 3 cases vides
  // .fill() remplit ces 3 cases avec "undefined" pour les rendre "parcourables"
  // .map((a, i) => ...) transforme chaque case en un tuyau : [position X, hauteur Y]
  // Chaque tuyau est espacé du précédent de (pipeGap + pipeWidth) pixels,
  // et démarre hors de l'écran, à droite (canvas.width + ...)
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);

  console.log(pipes); // pratique pour vérifier dans la console que les tuyaux sont bien générés
};

// ============================================================
// render() : LE COEUR DU JEU.
// Cette fonction dessine UNE SEULE image (une "frame") du jeu.
// Elle va se rappeler elle-même en boucle, environ 60 fois par seconde.
// ============================================================
const render = () => {
  index++; // à chaque frame, le compteur avance de 1 : c'est notre "horloge" interne

  // ---------- FOND QUI DEFILE (effet paralaxe) ----------

  // background qui défile : on dessine l'image du fond 2 fois, pour créer un effet de boucle infinie.
  // 4 premiers parametres = ou est ce que l'image est et les 4 derniers parametres c'est ou on va la coller
  // On dessine le fond une PREMIERE fois, décalé, pour préparer le raccord :
  ctx.drawImage(
    img,                                              // l'image source (le spritesheet)
    0,                                                 // x de départ dans l'image source
    0,                                                 // y de départ dans l'image source
    canvas.width,                                      // largeur qu'on prend dans l'image source
    canvas.height,                                     // hauteur qu'on prend dans l'image source
    -((index * (speed / 2)) % canvas.width) + canvas.width, // x où on colle sur le canvas (calcul de défilement)
    0,                                                 // y où on colle sur le canvas
    canvas.width,                                      // largeur affichée sur le canvas
    canvas.height                                      // hauteur affichée sur le canvas
  );

  // Effacer la superposition
  // On dessine le fond une DEUXIEME fois, juste à côté de la première,
  // pour qu'il n'y ait jamais de "trou" visible pendant le défilement.
  // Le modulo (%) fait boucler la position entre 0 et canvas.width à l'infini.
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width),
    0,
    canvas.width,
    canvas.height
  );

  // ---------- L'OISEAU : deux comportements selon l'état du jeu ----------

  if (gamePlaying) {
    // --- Cas 1 : la partie est en cours ---

    // On dessine l'oiseau à sa position FIXE (cTenth), à sa hauteur actuelle (flyHeight).
    // 432 = coordonnée X dans le spritesheet où commencent les images de l'oiseau
    // Math.floor((index % 9) / 3) fait alterner 3 poses (0, 1, 2) : c'est le battement d'ailes
    // ...size = équivaut à écrire "51, 36" (largeur, hauteur) grâce à l'opérateur spread
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );

    // Eviter que l'oiseau monte trop haut
    // (commentaire d'origine un peu trompeur : cette ligne gère surtout la CHUTE)
    // A chaque frame, la vitesse de chute augmente un peu : c'est la gravité qui s'accumule
    flight += gravity;

    // La position verticale de l'oiseau est mise à jour selon sa vitesse actuelle.
    // Math.min(...) l'empêche de descendre plus bas que le bas du canvas.
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    // --- Cas 2 : on est sur l'écran d'accueil, avant de jouer ---

    // Dessin de l'oiseau
    // The image object (as returned by document.getElementById) The X coordinate, The Y coordinate, The width to draw the image, The height to draw the image
    // Animation de l'oiseau = Math.floor + le modulo (3,6,9)
    // Même logique de dessin que ci-dessus, mais CENTRE horizontalement cette fois
    // (canvas.width / 2 - size[0] / 2 place l'oiseau au milieu de l'écran)
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );

    // Tant qu'on n'a pas cliqué, l'oiseau reste "flottant" au centre : pas de gravité
    flyHeight = canvas.height / 2 - size[1] / 2;

    // Ecrire dans le canva
    // ctx.fillText(texte, x, y) écrit du texte directement DANS le canvas
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText(`Cliquez pour jouer`, 48, 535);

    // On définit la police juste après (l'ordre n'est pas idéal mais fonctionne
    // car ces 2 lignes fillText seront redessinées à la frame suivante avec la bonne police)
    ctx.font = "bold 30px courier";
  }

  // ---------- LES TUYAUX (uniquement pendant la partie) ----------

  // Pipe display
  if (gamePlaying) {
    // .map() ici sert surtout à PARCOURIR le tableau (le résultat n'est pas utilisé)
    pipes.map((pipe) => {
      // pipe[0] = position X du tuyau, pipe[1] = hauteur de l'ouverture

      // Chaque tuyau avance vers la gauche à chaque frame
      pipe[0] -= speed;

      // top pipe : on dessine le tuyau DU HAUT
      // 588 - pipe[1] : on part du bas de la vignette "tuyau" dans le spritesheet
      // et on ne garde que la portion de hauteur pipe[1] (pour que le tuyau
      // s'arrête pile à la bonne hauteur, juste avant l'ouverture)
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );

      // bottom pipe : on dessine le tuyau DU BAS
      // Sa hauteur se déduit par calcul : tout l'espace canvas restant
      // en dessous de l'ouverture (pipe[1] + pipeGap)
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      // Le tuyau est-il complètement sorti de l'écran à gauche ?
      if (pipe[0] <= -pipeWidth) {
        // Le joueur vient de "passer" un tuyau : le score augmente
        currentScore++;
        // On met à jour le meilleur score si besoin (Math.max garde le plus grand des deux)
        bestScore = Math.max(bestScore, currentScore);

        // supprimer un poteau + en crée un nouveau
        // pipes.slice(1) = on retire le PREMIER tuyau du tableau (celui qui est sorti)
        // [...] = on garde les tuyaux restants
        // on ajoute un tout nouveau tuyau à la fin, positionné juste après le dernier. Slice(-1)[0] = on prend la position X du dernier tuyau du tableau, pour placer le nouveau juste après.
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
      }

      // si l'oiseau tap le un tuyau, c'est le game over
      // Détection de collision : on teste 3 conditions dans un tableau,
      // .every((elem) => elem) vérifie qu'ELLES SONT TOUTES VRAIES en même temps. cTenth = position X de l'oiseau, pipe[0] = position X du tuyau, pipe[1] = hauteur de l'ouverture du tuyau, flyHeight = position Y de l'oiseau
      if (
        [
          pipe[0] <= cTenth + size[0],       // le tuyau a atteint (ou dépassé) le bord droit de l'oiseau
          pipe[0] + pipeWidth <= cTenth,      // ... et son bord droit n'a pas encore dépassé l'oiseau
          pipe[1] > flyHeight ||              // l'oiseau est plus haut que le haut de l'ouverture
            pipe[1] + pipeGap < flyHeight + size[1], // ... ou plus bas que le bas de l'ouverture
        ].every((elem) => elem)
      ) {
        // Si les 3 conditions sont vraies : collision confirmée !
        gamePlaying = false; // retour à l'écran d'accueil
        setup();             // on réinitialise entièrement le jeu
      }
    });
  }

  // ---------- AFFICHAGE DU SCORE DANS LA PAGE (hors canvas) ----------

  // Ici on ne dessine plus dans le canvas : on modifie du HTML classique,
  // les deux <div> du bandeau de score au-dessus du canvas.
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  // ---------- BOUCLAGE ----------

  // C'est la ligne la plus importante de toute la fonction :
  // elle demande au navigateur de rappeler render() à la prochaine image.
  // Sans cette ligne, render() ne s'exécuterait qu'une seule fois !
  window.requestAnimationFrame(render);
};

// ============================================================
// DEMARRAGE DU PROGRAMME
// ============================================================

// Au chargement de l'image tu vas recharger le render
// On attend que l'image soit COMPLETEMENT chargée avant de lancer render(),
// sinon on essaierait de dessiner une image qui n'existe pas encore
img.onload = render;

// Clique sur l'oiseau
// On initialise une première fois l'état du jeu avant même le premier clic
setup();

// Premier écouteur : un clic n'importe où sur la page démarre la partie
// (fait passer gamePlaying de false à true)
document.addEventListener("click", () => (gamePlaying = true));

// Second écouteur : un clic (n'importe où aussi) fait "sauter" l'oiseau
// en lui redonnant instantanément la vitesse verticale du saut.
// Les deux écouteurs se déclenchent ensemble au premier clic : c'est voulu,
// la partie démarre ET l'oiseau saute en même temps.
window.onclick = () => (flight = jump);
