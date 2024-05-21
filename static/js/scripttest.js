const paragraphs = [
    "La quête de l'indépendance palestinienne a été un long et difficile voyage, marqué par la lutte, le sacrifice et la résilience. De la terre historique de Palestine s'élève un peuple uni dans sa détermination inébranlable à récupérer ses droits et sa souveraineté. L'appel à la liberté résonne dans les ruelles de Gaza, les collines de la Cisjordanie et les rues de Jérusalem. Le monde observe alors que les Palestiniens exigent courageusement leur droit à l'autodétermination, défiant les forces oppressives de l'occupation et de la colonisation. Chaque jour qui passe, le désir de liberté se renforce, alimenté par l'espoir collectif d'un avenir où la justice prévaut et où la Palestine se tient fièrement en tant que nation libre et indépendante.",
    "En solidarité avec le peuple palestinien, des voix du monde entier s'unissent pour condamner les injustices qui leur sont infligées. La lutte pour la liberté en Palestine résonne avec les valeurs universelles des droits de l'homme, de la dignité et de l'égalité. En tant que défenseurs de la justice, nous nous tenons aux côtés des Palestiniens, amplifiant leurs appels à la libération et à l'autodétermination. Des mouvements de base aux forums internationaux, la demande pour mettre fin à l'occupation et réaliser les droits des Palestiniens résonne avec une détermination inébranlable. Notre solidarité sert de phare d'espoir au milieu des ténèbres de l'oppression, inspirant les autres à rejoindre la noble cause de soutenir la quête de liberté de la Palestine.",
    "L'occupation de la Palestine est un rappel frappant des injustices durables qui affligent notre monde. Depuis des décennies, les Palestiniens endurent les dures réalités de l'occupation – des arrestations arbitraires et des démolitions aux confiscations de terres et à la violence des colons. Pourtant, face à de telles adversités, l'esprit palestinien reste inébranlable, alimenté par le désir indéfectible de liberté et de justice. Il est temps que la communauté internationale réponde aux appels à l'action et tienne pour responsables ceux qui perpétuent l'occupation. Ce n'est qu'à travers des efforts collectifs pour mettre fin à l'occupation que nous pourrons ouvrir la voie à un avenir où les Palestiniens pourront vivre dans la dignité et la souveraineté, libres de toute oppression et de toute peur.",
    "Au milieu des turbulences du conflit et de l'occupation, une lueur d'espoir brille dans le cœur des Palestiniens – l'espoir d'une paix juste et durable. Enracinée dans les principes d'égalité, de respect et de reconnaissance mutuelle, cette vision de la paix incarne les aspirations des Palestiniens pour un avenir où leurs droits sont respectés et leur dignité est honorée. C'est une vision qui rejette la violence et l'extrémisme, optant plutôt pour le dialogue, la réconciliation et la coexistence. Alors que nous œuvrons pour réaliser cette vision, restons unis dans notre engagement pour une résolution pacifique du conflit israélo-palestinien, une résolution qui garantit la sécurité et la prospérité pour tous, et qui ouvre la voie à un avenir plus radieux pour les générations à venir."
  ];
  
  const quoteSection = document.getElementById("quote");
  const userInput = document.getElementById("quote-input");
  let quote = "";
  let time = 60;
  let timer = "";
  let mistakes = 0;
  
  // Display random quotes
  const renderNewQuote = () => {
    quote = paragraphs[Math.floor(Math.random() * paragraphs.length)];
    const arr = quote.split("").map(value => `<span class='quote-chars'>${value}</span>`);
    quoteSection.innerHTML = arr.join("");
  };
  
  // Logic for comparing input words with quote
  userInput.addEventListener("input", () => {
    let quoteChars = Array.from(document.querySelectorAll(".quote-chars"));
    let userInputChars = userInput.value.split("");
  
    quoteChars.forEach((char, index) => {
      if (char.innerText == userInputChars[index]) {
        char.classList.add("success");
        char.classList.remove("fail");
      } else if (userInputChars[index] == null) {
        char.classList.remove("success", "fail");
      } else {
        if (!char.classList.contains("fail")) {
          mistakes++;
          char.classList.add("fail");
        }
        char.classList.remove("success");
      }
      document.getElementById("mistakes").innerText = mistakes;
    });
  
    if (quoteChars.every(char => char.classList.contains("success"))) {
      displayResult();
    }
  });
  
  const updateTimer = () => {
    if (time === 0) {
      displayResult();
    } else {
      document.getElementById("timer").innerText = --time + "s";
    }
  };
  
  const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
  };
  
  const displayResult = () => {
    clearInterval(timer);
    document.querySelector(".result").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
  
    let timeTaken = (60 - time) / 60;
    let wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
    let accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);
  
    document.getElementById("wpm").innerText = wpm + " wpm";
    document.getElementById("accuracy").innerText = accuracy + " %";
  
    if (accuracy >= 85 && wpm >= 28) {
      document.getElementById("certificate-btn").style.display = "block";
    }
  };
  
  const startTest = () => {
    mistakes = 0;
    userInput.value = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
  };
  
  const generateCertificate = async () => {
    const { jsPDF } = window.jspdf;
  
    // Obtenir les informations de l'utilisateur à partir de la session
    const response = await fetch('/get-user-info');
    const userData = await response.json();
  
    const { nom, prenom } = userData;
    const wpm = document.getElementById('wpm').innerText;
    const accuracy = document.getElementById('accuracy').innerText;
    const userName = `${prenom} ${nom}`;
  
    // Créer un nouveau document PDF
    const doc = new jsPDF('portrait', 'mm', 'a4');
  
    // Design for the certificate
    doc.setFillColor(255, 255, 255); // Background color
    doc.rect(10, 10, 190, 277, 'F'); // Certificate border
  
    doc.setFillColor(0, 51, 102);
    doc.rect(10, 10, 190, 30, 'F'); // Top border design
  
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // White color for text in the top border
    doc.text("CERTIFICATE OF ACHIEVEMENT", 105, 30, null, null, 'center');
  
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 50, 170, 190, 'F'); // Inner white background
  
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102); // Dark blue text
    doc.text("Certificat de Réalisation", 105, 80, null, null, 'center');
  
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("Ceci certifie que", 105, 100, null, null, 'center');
  
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(userName, 105, 120, null, null, 'center');
  
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("a atteint une vitesse de frappe de " + wpm + " WPM", 105, 140, null, null, 'center');
    doc.text("avec une précision de " + accuracy + "%", 105, 160, null, null, 'center');
  
    doc.setFontSize(16);
    doc.setFont("helvetica", "italic");
    doc.text("Félicitations pour votre excellente performance!", 105, 180, null, null, 'center');
  
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("TypiFast", 105, 200, null, null, 'center');
  
    // Save the PDF
    doc.save("certificat.pdf");
  };
  
  // Exemple de fonction pour terminer le test et afficher les résultats
  const endTest = () => {
    // Logique pour terminer le test
    console.log("Test terminé");
  
    // Simuler des résultats pour cet exemple
    document.getElementById('wpm').innerText = 75; // Exemple de WPM
    document.getElementById('accuracy').innerText = 98; // Exemple d'accuracy
  };
  
  document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('startTestButton').addEventListener('click', startTest);
    document.getElementById('endTestButton').addEventListener('click', endTest);
    document.getElementById('generateCertificateButton').addEventListener('click', generateCertificate);
  });
    
  const exitTest = () => {
    alert("Sortie du test...");
  };
  
  window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
  };
  