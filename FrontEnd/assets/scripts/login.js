document.addEventListener('DOMContentLoaded', function() {
  const userToken = localStorage.getItem('userToken');
  const logBtn = document.getElementById('userLoginBtn');
  const navPortModif = document.querySelector('nav.modifier');

  logBtn.addEventListener('click', function() {
    localStorage.removeItem('userToken');
    window.location.href = "login.html"; // Redirection vers la page de connexion
  });

  if (userToken) {
    // Lorsque l'utilisateur est supposé être connecté
    console.log("Utilisateur connecté !");
    logBtn.innerHTML = "logout"; // Modifier le texte du bouton
    navPortModif.style.display = 'block'; // Afficher le bouton "modifier"
  } else {
    // Lorsque l'utilisateur n'est pas connecté
    console.log("Utilisateur pas connecté !");
    logBtn.textContent = "login"; // Modifier le texte du bouton
    navPortModif.style.display = 'none'; // Cacher le bouton "modifier"
  }
});
