let firstClick = false;

$('.menu-toggle').off('click').on('click', function() {
  $('body').addClass('menu-collapsed');
  $(this).addClass('active');
});

$('.rain-toggle.toggle').off('click').on('click', function() {
  if ($('body').hasClass('menu-collapsed')) {
    $('body').removeClass('menu-collapsed');
    $('.menu-toggle').removeClass('active');
    return; 
  }

  $('body').toggleClass('rain-active');      
  $('body').toggleClass('back-row-active');   
  $(this).toggleClass('active');
  makeItRain();
});



document.addEventListener("DOMContentLoaded", () => {
    const soundBtn = document.querySelector(".sound-toggle");
    window.audio = document.getElementById("rain-audio");

    soundBtn.classList.add("active");
    window.soundEnabled = true;

    audio.volume = 0;
    audio.loop = true;

    let fadeInterval = null;

    function fadeAudio(target, speed = 0.02) {
        clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            if (audio.volume < target) {
                audio.volume = Math.min(audio.volume + speed, target);
            } else {
                audio.volume = Math.max(audio.volume - speed, target);

            }

            if (audio.volume === target) {
                if (target === 0) audio.pause();
                clearInterval(fadeInterval);
            }
        }, 50);
    }

    audio.muted = true;
    audio.play().then(() => {
        audio.muted = false;
    }).catch(() => {
        audio.muted = false;
    });

    soundBtn.addEventListener("click", () => {

        window.soundEnabled = !window.soundEnabled;
        soundBtn.classList.toggle("active", window.soundEnabled);

        if (window.soundEnabled) {
            audio.currentTime = 0;
            audio.play();
            fadeAudio(0.3);
        } else {
            fadeAudio(0);
        }
    });

    let lastRainState = document.body.classList.contains("");

    const observer = new MutationObserver(() => {
        const currentRainState = document.body.classList.contains("");

        if (currentRainState !== lastRainState) {
            if (currentRainState) {
                
                if (window.soundEnabled) {
                    audio.currentTime = 0;
                    audio.play();
                    fadeAudio(0.3);
                }
            } else {
                
                fadeAudio(0);
            }
        }

        lastRainState = currentRainState;
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });
});


window.firstClick = false;

makeItRain();

