

fetch('http://localhost:5678/api/works/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur réseau');
    }
    return response.json(); // Transforme la réponse en JSON
  })
  .then(data => {
    // Faire quelque chose avec les données récupérées
    console.log(data);
  })
  .catch(error => {
    // Attrape les erreurs de requête ou de traitement des données
    console.error('Erreur:', error);
  });
