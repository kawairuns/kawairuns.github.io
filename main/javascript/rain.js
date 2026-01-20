let firstClick = false;

function makeItRain() {
    $('.rain').empty();

    var increment = 0;
    var drops = "";
    var backDrops = "";

    while (increment < 100) {
        var randoHundo = Math.floor(Math.random() * 98 + 1);
        var randoFiver = Math.floor(Math.random() * 4 + 2);
        increment += randoFiver;

        drops += '<div class="drop" style="left:' + increment + '%; bottom:' + (100 + randoFiver*2 - 1) + '%; animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;">' +
                 '<div class="stem" style="animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;"></div>' +
                 '<div class="splat" style="animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;"></div></div>';

        backDrops += '<div class="drop" style="right:' + increment + '%; bottom:' + (100 + randoFiver*2 - 1) + '%; animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;">' +
                     '<div class="stem" style="animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;"></div>' +
                     '<div class="splat" style="animation-delay:0.' + randoHundo + 's; animation-duration:0.5' + randoHundo + 's;"></div></div>';
    }

    if ($('body').hasClass('rain-active')) {
        $('.rain.front-row').append(drops);
    }
    if ($('body').hasClass('back-row-active')) {
        $('.rain.back-row').append(backDrops);
    }
}

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

$('.back-row-btn').off('click').on('click', function() {
  $('body').toggleClass('back-row-active'); 
  $(this).toggleClass('active');
  makeItRain();
});

$('.splat-toggle.toggle').off('click').on('click', function() {
  $('body').toggleClass('splat-toggle');
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
        if (!document.body.classList.contains("rain-active")) return;

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

    let lastRainState = document.body.classList.contains("rain-active");

    const observer = new MutationObserver(() => {
        const currentRainState = document.body.classList.contains("rain-active");

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




