// Déclaration des paragraphes à utiliser
const paragraphs = [
    "Le développement de la technologie a profondément impacté notre société.",
    "La communication entre les individus est devenue plus rapide et plus accessible grâce à Internet.",
    "Cependant, cette rapidité a parfois des conséquences négatives sur notre concentration et notre capacité à réfléchir profondément.",
    "Il est important de trouver un équilibre entre l'utilisation des nouvelles technologies et le maintien de notre bien-être mental.",
    "La maîtrise de la vitesse de frappe peut être un atout précieux dans de nombreuses situations professionnelles.",
];

// Sélection des éléments HTML nécessaires
const texteSaisi = document.getElementById("paragraph");
const champSaisi = document.querySelector(".champ-saisie");
const boutonEssayerNouveau = document.getElementById("newGameBtn");
const baliseTemps = document.getElementById("tempsRestant");
const baliseErreur = document.getElementById("nbErreurs");
const baliseMPM = document.getElementById("mpm");
const baliseCPM = document.getElementById("cpm");

// Variables pour la minuterie et les compteurs
let minuterie;
let tempsMax = 60;
let tempsRestant = tempsMax;
let indexCaractere = erreurs = enTrainDeSaisir = 0;

// Fonction pour choisir un paragraphe aléatoire et l'afficher
function chargerParagraphe() {
    const indexAleatoire = Math.floor(Math.random() * paragraphs.length);
    texteSaisi.innerText = paragraphs[indexAleatoire];
}

// Fonction pour initialiser la saisie
function initSaisie() {
    // Démarrer la minuterie si ce n'est pas déjà fait
    if (!enTrainDeSaisir) {
        minuterie = setInterval(initMinuterie, 1000);
        enTrainDeSaisir = true;
    }

    // Vérifier la saisie de l'utilisateur caractère par caractère
    let caractereSaisi = champSaisi.value[indexCaractere];
    let caractereAttendu = texteSaisi.innerText[indexCaractere];

    if (caractereSaisi === caractereAttendu) {
        // Caractère correct
        texteSaisi.innerHTML = texteSaisi.innerHTML.replace(`<span>${caractereAttendu}</span>`, `<span class="correct">${caractereAttendu}</span>`);
    } else {
        // Caractère incorrect
        texteSaisi.innerHTML = texteSaisi.innerHTML.replace(`<span>${caractereAttendu}</span>`, `<span class="incorrect">${caractereAttendu}</span>`);
        erreurs++;
    }

    // Passer au caractère suivant
    indexCaractere++;

    // Mettre à jour les compteurs et afficher les résultats si nécessaire
    if (indexCaractere === texteSaisi.innerText.length) {
        afficherResultats();
    }
}

// Fonction pour démarrer la minuterie et afficher le temps restant
function initMinuterie() {
    tempsRestant--;
    baliseTemps.innerText = tempsRestant;
    if (tempsRestant === 0) {
        afficherResultats();
    }
}

// Fonction pour afficher les résultats dans une boîte de dialogue
function afficherResultats() {
    // Calculer les mots par minute (MPM) et la précision
    let motsTapes = texteSaisi.innerText.split(" ").length;
    let tempsEcoule = tempsMax - tempsRestant;
    let motsParMinute = Math.round((motsTapes / tempsEcoule) * 60);
    let precision = Math.round(((texteSaisi.innerText.length - erreurs) / texteSaisi.innerText.length) * 100);

    // Afficher les résultats dans une boîte de dialogue
    Swal.fire({
        title: "Résultats",
        html: `<p>MPM: ${motsParMinute}</p><p>Précision: ${precision}%</p>`,
        confirmButtonText: "OK",
    }).then(() => {
        // Réinitialiser le jeu pour permettre une nouvelle partie
        reinitialiserPartie();
    });

    // Arrêter la minuterie
    clearInterval(minuterie);
}

// Fonction pour réinitialiser le jeu
function reinitialiserPartie() {
    // Réinitialiser les compteurs et le texte affiché
    indexCaractere = erreurs = enTrainDeSaisir = 0;
    tempsRestant = tempsMax;
    baliseTemps.innerText = tempsRestant;
    baliseErreur.innerText = erreurs;

    // Vider le champ de saisie et charger un nouveau paragraphe
    champSaisi.value = "";
    chargerParagraphe();
}

// Événements pour démarrer la saisie et réinitialiser le jeu
champSaisi.addEventListener("input", initSaisie);
boutonEssayerNouveau.addEventListener("click", reinitialiserPartie);

// Charger un paragraphe au chargement de la page
chargerParagraphe();
