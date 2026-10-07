# 🦜 Floppy Perroquet

> Un clone de **Flappy Bird** codé en **JavaScript vanilla** avec l'API **Canvas 2D**, sans framework ni librairie.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

🎮 **[Jouer en ligne](https://aurored2-star.github.io/floppy-perroquet/)**

---

## 📖 À propos

Floppy Perroquet est un petit jeu d'arcade réalisé dans le cadre de ma formation de **Développeuse Web et Web Mobile (DWWM)**.
L'objectif : comprendre comment fonctionne un jeu dans le navigateur, de la boucle d'animation à la détection de collisions, en partant de zéro.

Le code de `script.js` est **commenté ligne par ligne** pour servir de support d'apprentissage.

## 🕹️ Comment jouer

- **Cliquez** n'importe où pour lancer la partie.
- **Cliquez** pour faire voler le perroquet.
- Passez entre les tuyaux sans les toucher.
- Chaque tuyau franchi rapporte **1 point**. Votre meilleur score est conservé pendant la session.

## ✨ Fonctionnalités

- Fond qui défile en boucle (effet parallaxe)
- Animation du battement d'ailes à partir d'un spritesheet
- Gravité et saut gérés par une physique simple
- Génération aléatoire de la hauteur des tuyaux
- Détection des collisions
- Score actuel et meilleur score affichés en temps réel
- Police rétro *Press Start 2P* pour l'ambiance arcade

## 🧠 Ce que j'ai appris

| Notion | Utilisation dans le projet |
|---|---|
| **Canvas 2D** (`getContext`, `drawImage`, `fillText`) | Dessiner le décor, l'oiseau, les tuyaux et le texte |
| **Spritesheet** | Découper toutes les images du jeu dans un seul fichier PNG |
| **Boucle de jeu** (`requestAnimationFrame`) | Redessiner l'écran environ 60 fois par seconde |
| **Physique simple** | Gravité qui s'accumule, saut avec une vitesse négative (axe Y inversé) |
| **Modulo `%`** | Faire boucler le défilement du fond et l'animation des ailes |
| **Tableaux** (`map`, `slice`, `every`, spread `...`) | Gérer la file des 3 tuyaux et tester les collisions |
| **Événements** (`addEventListener`, `onclick`) | Démarrer la partie et faire sauter l'oiseau |
| **Manipulation du DOM** | Mettre à jour le bandeau de score en HTML |

## 📁 Structure du projet

```
floppy-perroquet/
├── index.html          # Structure de la page et du canvas
├── style.css           # Mise en page et police rétro
├── script.js           # Toute la logique du jeu (commentée)
└── media/
    └── flappy-bird-set.png   # Spritesheet (fond, oiseau, tuyaux)
```

## 🚀 Lancer le projet en local

Aucune installation nécessaire.

```bash
git clone https://github.com/aurored2-star/floppy-perroquet.git
cd floppy-perroquet
```

Ouvrez ensuite `index.html` dans votre navigateur, ou utilisez l'extension **Live Server** de VS Code.

## 🔧 Pistes d'amélioration

- [ ] Jouer aussi avec la barre **Espace** et au **toucher** sur mobile
- [ ] Sauvegarder le meilleur score avec `localStorage`
- [ ] Ajouter des effets sonores
- [ ] Augmenter progressivement la difficulté
- [ ] Rendre le canvas responsive

## 🙏 Crédits

- Inspiré du jeu **Flappy Bird** de Dong Nguyen (.GEARS Studios)
- Police : [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)

## 👩‍💻 Autrice

**Aurore Dufour**, développeuse web & mobile en formation
[GitHub](https://github.com/aurored2-star)
