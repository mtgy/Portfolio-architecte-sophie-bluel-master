

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
    itemGallery(data);
  
  })
  .catch(error => {
    // Attrape les erreurs de requête ou de traitement des données
    console.error('Erreur:', error);
  });


  function itemGallery(data) {
    // Récupération de la div parent
    let gallery = document.querySelector(".gallery");
  
    for (var i = 0; i < data.length; i++) {
      // Création de la balise figure
      let figureItemGallery = document.createElement("figure");
      gallery.appendChild(figureItemGallery);
  
      // Création de la balise img
      let imageItemGallery = document.createElement("img");
      imageItemGallery.src = data[i].imageUrl;
      // Attribution de l'attribut alt
      imageItemGallery.setAttribute("alt", data[i].title);
      figureItemGallery.appendChild(imageItemGallery);
  
      // Création de la balise caption
      let captionItemGallery = document.createElement("figcaption");
      captionItemGallery.innerHTML = data[i].title;
      figureItemGallery.appendChild(captionItemGallery); // Attache la légende à la figure
    }
  }