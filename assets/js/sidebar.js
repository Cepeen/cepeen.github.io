toggleBtn.addEventListener('click', () => {
    const currentRight = parseInt(getComputedStyle(sidebar).right, 10);
    sidebar.style.right = currentRight === 0 ? '-350px' : '0';
    toggleBtn.innerHTML = currentRight === 0 ? '&#9664;' : '&#9654;';
  });