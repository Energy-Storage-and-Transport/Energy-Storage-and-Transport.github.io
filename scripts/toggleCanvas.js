function toggleCanvas() {
    const canvas = document.getElementById('foldable-canvas');
    const button = document.querySelector('.toggle-button');
  
    if (canvas.style.display === 'block') {
      canvas.style.display = 'none';
      canvas.style.height = '0';
      button.classList.remove('opened');
      button.classList.add('closed');
      button.style.display = 'block';
    } else {
      canvas.style.display = 'block';
      canvas.style.height = `${canvas.offsetWidth * 2}px`;
      button.classList.remove('closed');
      button.classList.add('opened');
      button.style.display = 'none';
    }
  }