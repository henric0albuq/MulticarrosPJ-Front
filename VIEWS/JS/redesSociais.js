document.querySelector('.social-float').addEventListener('click', function(e) {
    this.classList.toggle('active');
    e.stopPropagation();
  });
  document.addEventListener('click', function() {
    document.querySelector('.social-float').classList.remove('active');
  });
