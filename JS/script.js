document.addEventListener('DOMContentLoaded', () => { 
    // Garante que o código só será executado após o carregamento completo do DOM.

    const mainMenu = document.getElementById('main-menu');
    const tutorialScreen = document.getElementById('tutorial-screen');
    const optionsScreen = document.getElementById('options-screen');
    const creditsScreen = document.getElementById('credits-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const quizImage = document.getElementById('quiz-image');
    // Obtém referências para os elementos de tela e imagem do quiz.

    const playButton = document.getElementById('play-button');
    const tutorialButton = document.getElementById('tutorial-button');
    const optionsButton = document.getElementById('options-button');
    const creditsButton = document.getElementById('credits-button');
    const backToMenuButtons = document.querySelectorAll('.back-button');
    const playAgainButton = document.getElementById('play-again-button');
    const inGameOptionsButton = document.getElementById('in-game-options-button');
    // Obtém referências para os botões de navegação e controle do jogo.

    const backgroundMusic = document.getElementById('background-music');
    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');
    const victorySound = document.getElementById('victory-sound');
    const defeatSound = document.getElementById('defeat-sound');
    // Obtém referências para os elementos de áudio.

    const musicVolumeControl = document.getElementById('music-volume');
    const effectsVolumeControl = document.getElementById('effects-volume');
    // Obtém referências para os controles de volume de música e efeitos sonoros.

    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let previousScreen = mainMenu;
    // Declaração de variáveis para controlar o estado atual do jogo.

    const questions = [
        { image: "question1.png", answers: ["ÉMILE DURKHEIM", "AUGUSTE COMTE", "HERBERT SPENCER", "GEORG SIMMEL"], correct: 0, answerImage: "answer1.png" }, 
        { image: "question2.png", answers: ["HANNAH ARENDT", "MAX WEBER", "KARL MARX", "THEODOR W ADORNO"], correct: 0, answerImage: "answer2.png" }, 
        { image: "question3.png", answers: ["FLORESTAN FERNANDES", "KARL MARX", "GILBERTO FREYRE", "ZYGMUNT BAUMAN"], correct: 1, answerImage: "answer3.png" }, 
        { image: "question4.png", answers: ["AUGUSTE COMTE", "ZYGMUNT BAUMAN", "ÉMILE DURKHEIM", "GILBERTO FREYRE"], correct: 0, answerImage: "answer4.png" }, 
        { image: "question5.png", answers: ["PIERRE BOURDIEU", "MAX WEBER", "ROBERT K. MERTON", "KARL MARX"], correct: 1, answerImage: "answer5.png" }, 
        { image: "question6.png", answers: ["ROLAND BARTHES", "TALCOTT PARSONS", "AUGUSTE COMTE", "ZYGMUNT BAUMAN"], correct: 3, answerImage: "answer6.png" }, 
        { image: "question7.png", answers: ["FLORA TRISTAN", "ANNA JULIA COOPER", "HARRIET MARTINEAU", "HANNAH ARENDT"], correct: 3, answerImage: "answer7.png" }, 
        { image: "question8.png", answers: ["HANNAH ARENDT", "ALAIN TOURAINE", "ÉMILE DURKHEIM", "ZYGMUNT BAUMAN"], correct: 2, answerImage: "answer8.png" }, 
        { image: "question9.png", answers: ["ZYGMUNT BAUMAN", "PIERRE BOURDIEU", "AUGUSTE COMTE", "ROBERT K. MERTON"], correct: 2, answerImage: "answer9.png" }, 
        { image: "question10.png", answers: ["ÉMILE DURKHEIM", "MAX WEBER", "GILBERTO FREYRE", "PIERRE BOURDIEU"], correct: 1, answerImage: "answer10.png" }, 
    ];
    // Array de objetos contendo as questões do quiz, respostas e imagens.

    playButton.addEventListener('click', startQuiz);
    tutorialButton.addEventListener('click', () => showScreen(tutorialScreen));
    optionsButton.addEventListener('click', () => {
        previousScreen = mainMenu;
        showScreen(optionsScreen);
    });
    creditsButton.addEventListener('click', () => showScreen(creditsScreen));
    backToMenuButtons.forEach(button => button.addEventListener('click', () => showScreen(mainMenu)));
    playAgainButton.addEventListener('click', resetQuiz);
    inGameOptionsButton.addEventListener('click', () => {
        previousScreen = quizScreen;
        showScreen(optionsScreen);
    });
    // Associa funções específicas a serem executadas quando os botões são clicados.

    musicVolumeControl.addEventListener('input', () => {
        backgroundMusic.volume = musicVolumeControl.value;
    });
    effectsVolumeControl.addEventListener('input', () => {
        const volume = effectsVolumeControl.value;
        correctSound.volume = volume;
        wrongSound.volume = volume;
        victorySound.volume = volume;
        defeatSound.volume = volume;
    });
    // Ajusta o volume da música de fundo e dos efeitos sonoros com base na interação do usuário.

    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
        if (screen === optionsScreen) {
            backToMenuButtons.forEach(button => button.onclick = () => showScreen(previousScreen));
        }
    }
    // Exibe a tela passada como argumento e desativa as demais.

    function startQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        showScreen(quizScreen);
        backgroundMusic.play();
        loadQuestion();
    }
    // Reseta a pontuação e o índice da questão atual, inicia o quiz e carrega a primeira questão.

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endQuiz();
            return;
        }

        const questionData = questions[currentQuestionIndex];
        quizImage.src = `images/${questionData.image}`;
        questionData.answers.forEach((answer, index) => {
            const button = document.getElementById(`answer-${index + 1}`);
            button.innerText = answer;
            button.classList.remove('correct', 'wrong', 'disabled'); // Reseta as cores e estado dos botões
            button.onclick = () => checkAnswer(index);
        });

        startTimer();
    }
    // Carrega a próxima questão e define os textos dos botões de resposta.

    function startTimer() {
        let timeLeft = 10;
        const timerElement = document.getElementById('timer');
        timerElement.innerText = timeLeft;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showAnswer(); // Mostra a resposta quando o tempo acabar
            }
        }, 1000);
    }
    // Inicia o cronômetro para a questão atual.

    function checkAnswer(selectedIndex) {
        clearInterval(timerInterval);
        disableAnswerButtons();
        const questionData = questions[currentQuestionIndex];
        const correctIndex = questionData.correct;

        if (selectedIndex === correctIndex) {
            score++;
            correctSound.play();
            document.getElementById(`answer-${selectedIndex + 1}`).classList.add('correct');
        } else {
            wrongSound.play();
            document.getElementById(`answer-${selectedIndex + 1}`).classList.add('wrong');
        }

        showAnswer();
    }
    // Verifica se a resposta está correta, atualiza a pontuação e destaca a resposta correta.

    function showAnswer() {
        disableAnswerButtons();
        const questionData = questions[currentQuestionIndex];
        const correctIndex = questionData.correct;
        document.getElementById(`answer-${correctIndex + 1}`).classList.add('correct');

        setTimeout(() => {
            currentQuestionIndex++;
            enableAnswerButtons();
            loadQuestion();
        }, 2000);
    }
    // Mostra a resposta correta e prepara para a próxima pergunta.

    function endQuiz() {
        showScreen(resultScreen);
        const resultMessage = document.getElementById('result-message');
        resultMessage.innerText = `Pontuação: ${score}/10`;
        if (score > 5) {
            victorySound.play();
            resultScreen.style.backgroundImage = "url('images/victory.png')";
        } else {
            defeatSound.play();
            resultScreen.style.backgroundImage = "url('images/defeat.png')";
        }
    }
    // Mostra a tela de resultados, exibe a pontuação final e toca o som de vitória ou derrota, dependendo da pontuação do usuário.

    function resetQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        showScreen(mainMenu);
    }
    // Reseta a pontuação e o índice da questão atual e volta à tela principal.

    function disableAnswerButtons() {
        document.querySelectorAll('.answer-button').forEach(button => button.classList.add('disabled'));
    }
    // Desativa todos os botões de resposta, impedindo que o usuário clique novamente enquanto a questão está sendo avaliada.

    function enableAnswerButtons() {
        document.querySelectorAll('.answer-button').forEach(button => button.classList.remove('disabled'));
    }
    // Reativa todos os botões de resposta para a próxima pergunta.

    showScreen(mainMenu);
    // No final, chama a função showScreen(mainMenu); para garantir que a tela principal do menu seja exibida quando o jogo começar.
});