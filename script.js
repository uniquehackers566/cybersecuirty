// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Dark mode toggle button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      if (document.body.classList.contains('light')) {
        themeBtn.innerText = 'Dark Mode';
      } else {
        themeBtn.innerText = 'Light Mode';
      }
    });
  }

  // Quiz logic (only if quiz elements exist on the page)
  const quizQ = document.getElementById('quizQ');
  if (quizQ) {
    const quizData = [
      {
        q: "What's the safest way to create a password?",
        options: [
          "Use your birthdate for easy remembering",
          "Use a long passphrase or random string with numbers and symbols",
          "Reuse your Facebook password everywhere"
        ],
        answer: 1
      },
      {
        q: "A website link looks like your bank, but the email is odd. What do you do?",
        options: [
          "Log in fast, as it says it's urgent",
          "Click and enter your details",
          "Don't click and verify the link through your browser manually"
        ],
        answer: 2
      },
      {
        q: "What's the easiest way to keep your device secure against new malware?",
        options: [
          "Update your device software regularly",
          "Never use Wi-Fi",
          "Only use old apps"
        ],
        answer: 0
      }
    ];
    let quizStep = 0;
    const quizOptions = document.getElementById('quizOptions');
    const quizResult = document.getElementById('quizResult');

    function clearQuizOptions() {
      quizOptions.innerHTML = '';
    }

    function loadQuiz() {
      quizQ.innerText = quizData[quizStep].q;
      quizOptions.innerHTML = '';  // clear previous options
      quizData[quizStep].options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkQuiz(i);
        quizOptions.appendChild(btn);
      });
      quizResult.innerText = '';
    }

    function checkQuiz(selected) {
      if (selected === quizData[quizStep].answer) {
        quizResult.innerText = "Correct! 🎉";
        setTimeout(() => {
          quizStep = (quizStep + 1) % quizData.length;
          loadQuiz();
        }, 900);
      } else {
        quizResult.innerText = "Oops, that's not right. Try again!";
      }
    }

    // Initialize the first question
    loadQuiz();
  }
});
