document.querySelector('.social-float').addEventListener('click', function(e) {
    this.classList.toggle('active');
    e.stopPropagation();
  });
  document.addEventListener('click', function() {
    document.querySelector('.social-float').classList.remove('active');
  });

// WhatsApp jump animation controlled by JS: add/remove class periodically
(function(){
  const whatsapp = document.querySelector('.whatsapp');
  if(!whatsapp) return;

  let jumpInterval = null;

  function doJumpOnce(){
    whatsapp.classList.add('whatsapp-jump');
    setTimeout(()=> whatsapp.classList.remove('whatsapp-jump'), 700);
  }

  function startJumping(){
    if(jumpInterval) return;
    // initial jump after small delay
    jumpInterval = setInterval(doJumpOnce, 3000);
    // trigger one immediately (after slight delay) so user sees it
    setTimeout(doJumpOnce, 900);
  }

  function stopJumping(){
    if(jumpInterval){ clearInterval(jumpInterval); jumpInterval = null; }
    whatsapp.classList.remove('whatsapp-jump');
  }

  // Start automatically
  startJumping();

  // Pause on hover/focus to avoid distraction while interacting
  whatsapp.addEventListener('mouseenter', stopJumping);
  whatsapp.addEventListener('focus', stopJumping);
  whatsapp.addEventListener('mouseleave', startJumping);
  whatsapp.addEventListener('blur', startJumping);
})();
