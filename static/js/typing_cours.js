let paragraphs = [
    "a aa aaa aaaa aaa aa a",
    "b bb bbb bbbb bbb bb b",
    "c cc ccc cccc ccc cc c",
    "d dd ddd dddd ddd dd d",
    "abcd bcad cbab bacd dabc cba dbda cbab caba bacca bad",
    "abandonner baccalaureat dactylographie", 
    "décapiter abcès cabine déboucher découvrir",
    "e ee eee eeee eee ee e",
    "f ff fff ffff fff ff f",
    "g gg ggg gggg ggg gg g",
    "h hh hhh hhhh hhh hh h",
    "efgh eghf feg hegf fehg hhef gehg gfef hefg eggh heef",
    "effort engouement hauteur hégémonie", 
    "héroïsme hébergement holographie héliographie",
    "héritage horlogerie hébété effet hélice",
    "héritier hiérarchie héritage hypothèse",
    "i ii iii iiii iii ii i",
    "j jj jjj jjjj jjj jj j",
    "k kk kkk kkkk kkk kk k",
    "l ll lll llll lll ll l",
    "ijkl lkji kijl klji iklj llij kkijl lkji kljilk kljilj lkjli",
    "injure jaloux kilogramme liqueur", 
    "illégal jouer klaxon livre",
    "jalousie injuste klaxonner lithographie",
    "m mm mmm mmmm mmm mm m",
    "n nn nnn nnnn nnn nn n",
    "o oo ooo oooo ooo oo o",
    "p pp ppp pppp ppp pp p",
    "mnop mmno mono mnpo mpon mpno monno mppn mnop nopm noop npmm ",
    "monopole ponctuel moment panorama",
    "pomponner manipuler nomenclature promotion",
    "morpion omniprésent promotion manipulation",
    "comprendre démonstration champion composition",
    "q qq qqq qqqq qqq qq q",
    "r rr rrr rrrr rrr rr r",
    "s ss sss ssss sss ss s",
    "t tt ttt tttt ttt tt t",
    "qrst qqst qrrs rstq tqqr strs qsqs trsq rtsq qsrs trst qqtqtr",
    "quartier requin restaurer quart risque",
    "quitter rester quand route triste",
    "question traquer tris quartier raquette",
    "transport triage trait rituel quarantaine",
    "u uu uuu uuuu uuu uu u",
    "v vv vvv vvvv vvv vv v",
    "w ww www wwww www ww w",
    "x xx xxx xxxx xxx xx x", 
    "uvxw xwxw vxwu uwxuw uxwvu vvuy vxwu vuxv uwxv vwuw xuxv xwvu",
    "watt wax watt wax watt",
    "wax watt wax voue vue",
    "vaux aux roux vue voler",
    "votr valeur voiture vexer vexant",
    "y yy yyy yyyy yyy yy y",
    "z zz zzz zzzz zzz zz z",
    "zz zyzy yy yzyz zyyyz yzyzy yzyyz zyzyz zyyzzz zzyzy zyzyyzyzz",
    "zygomatique zygotique yoga yaourt zyme",
    "zeste zenith yeti zygote zyeuter",
    "pays analyser bayer calypt enzymatique",
    "analyse voyage joyeux crazy lazy",
];

// paragraphs = [paragraphs[0]]

const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".input-field"),
    tryAgainBtn = document.querySelector(".try-again"),
    continueBtn = document.querySelector(".continue"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span");

console.log(continueBtn)
console.log("----------------")

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0,
    currentSentenceIndex = +localStorage.getItem("currentSentenceIndex") || 0

function loadSentence() {
    typingText.innerHTML = "";
    paragraphs[currentSentenceIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
    continueBtn.disabled = true;
    continueBtn.style.display = "none";
}

function initTyping() {
    idTest = Math.random(10000000)
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        }

        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        let cpm = charIndex - mistakes;
        let accuracy = ((charIndex - mistakes) / charIndex) * 100;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = cpm;

        // Show the continue button if the sentence is complete, mistakes < 8, and wpm > 20
        if (charIndex >= characters.length && mistakes < 8 && wpm > 20) {
            continueBtn.style.display = "block";
            continueBtn.disabled = false;

            // Send statistics to the server
            sendStatistics(wpm, cpm, accuracy, mistakes);
        } else {
            continueBtn.style.display = "none";
        }
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function sendStatistics(wpm, cpm, accuracy, mistakes) {
    fetch('/save-statistics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            wpm: wpm,
            cpm: cpm,
            accuracy: accuracy,
            mistakes: mistakes,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
        } else {
            console.error(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function resetTest() {
    loadSentence();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = mistakes;
    cpmTag.innerText = 0;
}

loadSentence();
continueBtn.addEventListener("click", () => {
    if (currentSentenceIndex < paragraphs.length - 1) {
        currentSentenceIndex++;
    } else {
        window.location.href ="/test"
        // currentSentenceIndex = 0;
    }

    localStorage.setItem("currentSentenceIndex", currentSentenceIndex)
    // post to  /save_course_progress and save progress
    resetTest();
});
inpField.addEventListener("input", initTyping);
// tryAgainBtn.addEventListener("click", resetTest);

