// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle logic for all pages
  function setTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light');
      themeBtn.innerText = 'Dark Mode';
    } else {
      document.body.classList.remove('light');
      themeBtn.innerText = 'Light Mode';
    }
    localStorage.setItem('theme', mode);
  }

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // Quiz logic (only if quiz elements exist on the page)
  const quizQ = document.getElementById('quizQ');
  if (quizQ) {
    const quizDataOriginal = [
      {
        q: "What's the safest way to create a password?",
        options: [
          "Use your birthdate for easy remembering",
          "Use a long passphrase or random string with numbers and symbols",
          "Reuse your Facebook password everywhere"
        ],
        answer: 1,
        explanation: "A long, unique passphrase or random string with numbers and symbols is much harder to guess or crack."
      },
      {
        q: "A website link looks like your bank, but the email is odd. What do you do?",
        options: [
          "Log in fast, as it says it's urgent",
          "Click and enter your details",
          "Don't click and verify the link through your browser manually"
        ],
        answer: 2,
        explanation: "Always verify suspicious links directly in your browser. Phishing emails often use urgency to trick you."
      },
      {
        q: "What's the easiest way to keep your device secure against new malware?",
        options: [
          "Update your device software regularly",
          "Never use Wi-Fi",
          "Only use old apps"
        ],
        answer: 0,
        explanation: "Regular updates patch security holes and protect you from new threats."
      },
      {
        q: "What is the hardest part of cyber security?",
        options: [
          "Keeping up with new threats",
          "Buying expensive hardware",
          "Learning to code"
        ],
        answer: 0,
        explanation: "Cyber threats evolve quickly, so staying updated is a constant challenge."
      },
      {
        q: "Which protocol is most secure for encrypting web traffic?",
        options: [
          "HTTP",
          "FTP",
          "HTTPS"
        ],
        answer: 2,
        explanation: "HTTPS encrypts data between your browser and the website, keeping it private."
      },
      {
        q: "What is a common sign of a phishing attack?",
        options: [
          "Unexpected requests for sensitive information",
          "Receiving a regular newsletter",
          "A website using HTTPS"
        ],
        answer: 0,
        explanation: "Phishing often involves urgent or unexpected requests for personal data."
      },
      {
        q: "Which of the following is NOT a form of multi-factor authentication?",
        options: [
          "Password and SMS code",
          "Password and fingerprint",
          "Password and username"
        ],
        answer: 2,
        explanation: "Username and password alone is single-factor authentication."
      },
      {
        q: "What does a firewall do?",
        options: [
          "Encrypts your files",
          "Blocks unauthorized network access",
          "Deletes malware automatically"
        ],
        answer: 1,
        explanation: "A firewall monitors and blocks unauthorized network traffic."
      },
      {
        q: "Which attack involves tricking users into revealing confidential information?",
        options: [
          "DDoS attack",
          "Social engineering",
          "SQL injection"
        ],
        answer: 1,
        explanation: "Social engineering manipulates people into giving up sensitive info."
      },
      {
        q: "What is the best way to protect against ransomware?",
        options: [
          "Regularly back up your data",
          "Open all email attachments",
          "Disable antivirus software"
        ],
        answer: 0,
        explanation: "Backups let you recover your files if ransomware strikes."
      }
    ];
    let quizData = [];
    let quizStep = 0;
    let quizScore = 0;
    let userAnswers = [];
    const quizOptions = document.getElementById('quizOptions');
    const quizResult = document.getElementById('quizResult');
    const quizQ = document.getElementById('quizQ');
    const quizSection = document.querySelector('.quiz-section');
    const quizScoreDisplay = document.createElement('div');
    quizScoreDisplay.id = 'quizScoreDisplay';
    quizScoreDisplay.style.margin = '1rem 0';
    quizSection.insertBefore(quizScoreDisplay, quizResult);
    // Progress bar
    const quizProgressBar = document.createElement('div');
    quizProgressBar.id = 'quizProgressBar';
    quizProgressBar.style.height = '12px';
    quizProgressBar.style.background = '#0ffad6';
    quizProgressBar.style.borderRadius = '6px';
    quizProgressBar.style.margin = '0.5rem 0';
    quizSection.insertBefore(quizProgressBar, quizScoreDisplay);

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function updateProgressBar() {
      const percent = Math.round((quizStep / quizData.length) * 100);
      quizProgressBar.style.width = percent + '%';
      quizProgressBar.style.transition = 'width 0.3s';
      quizProgressBar.style.background = percent === 100 ? '#0eccf8' : '#0ffad6';
    }

    function updateScoreDisplay() {
      quizScoreDisplay.innerText = `Score: ${quizScore} / ${quizData.length}`;
    }

    function clearQuizOptions() {
      quizOptions.innerHTML = '';
    }

    function loadQuiz() {
      updateScoreDisplay();
      updateProgressBar();
      quizQ.innerText = `Question ${quizStep + 1} of ${quizData.length}:\n` + quizData[quizStep].q;
      quizOptions.innerHTML = '';
      quizData[quizStep].options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkQuiz(i);
        quizOptions.appendChild(btn);
      });
      quizResult.innerText = '';
    }

    function showReview() {
      quizQ.innerText = 'Review Your Answers:';
      quizOptions.innerHTML = '';
      const reviewList = document.createElement('ol');
      quizData.forEach((q, idx) => {
        const li = document.createElement('li');
        li.style.marginBottom = '1em';
        li.innerHTML = `<b>${q.q}</b><br>` +
          q.options.map((opt, i) => {
            let style = '';
            if (i === q.answer) style += 'color:#22e39c;font-weight:bold;';
            if (userAnswers[idx] === i && i !== q.answer) style += 'color:#e34c4c;text-decoration:line-through;';
            return `<span style="${style}">${opt}</span>`;
          }).join('<br>') +
          `<br><span style="font-size:0.95em;">Your answer: <b>${q.options[userAnswers[idx]] ?? 'No answer'}</b></span>` +
          (userAnswers[idx] === q.answer ? ' <span style="color:#22e39c;">✔</span>' : ' <span style="color:#e34c4c;">✘</span>');
        reviewList.appendChild(li);
      });
      quizOptions.appendChild(reviewList);
      quizResult.innerText = '';
    }

    function showRetryButton() {
      const retryBtn = document.createElement('button');
      retryBtn.innerText = 'Retry Quiz';
      retryBtn.style.marginTop = '1rem';
      retryBtn.onclick = () => {
        quizData = shuffle([...quizDataOriginal]);
        quizStep = 0;
        quizScore = 0;
        userAnswers = [];
        updateProgressBar();
        loadQuiz();
        quizResult.innerText = '';
        quizScoreDisplay.innerText = '';
        retryBtn.remove();
      };
      quizSection.appendChild(retryBtn);
    }

    function checkQuiz(selected) {
      userAnswers[quizStep] = selected;
      if (selected === quizData[quizStep].answer) {
        quizResult.innerHTML = "Correct! 🎉<br><span style='font-size:0.95em;color:#0eccf8;'>" + (quizData[quizStep].explanation || '') + "</span>";
        quizScore++;
      } else {
        quizResult.innerHTML = "Oops, that's not right. Try again!<br><span style='font-size:0.95em;color:#0eccf8;'>" + (quizData[quizStep].explanation || '') + "</span>";
        return;
      }
      updateScoreDisplay();
      setTimeout(() => {
        quizStep++;
        if (quizStep < quizData.length) {
          loadQuiz();
        } else {
          quizQ.innerText = "Quiz Completed!";
          quizOptions.innerHTML = '';
          quizResult.innerText = `Your final score: ${quizScore} / ${quizData.length}`;
          quizScoreDisplay.innerText = '';
          updateProgressBar();
          showRetryButton();
          showReview();
        }
      }, 1200);
    }

    // Initialize the quiz with random order
    quizData = shuffle([...quizDataOriginal]);
    updateProgressBar();
    loadQuiz();
  }

  // Scroll to top button
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.title = 'Scroll to top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '↑';
  document.body.appendChild(scrollBtn);
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  scrollBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});
