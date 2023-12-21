document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Envoi des données d'authentification 
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Convertir la réponse en JSON
        } else {
            throw new Error('Authentification échouée');
        }
    })
    .then(data => {
        // Stocker les infos dans le localStorage
        localStorage.setItem('userToken', data.token); 
        
        // redirection sur l'index
        window.location.href = "index.html"; 
    })
    .catch(error => {
        alert("Authentification incorrecte", error);
    });
});
