// Fonction de récupération des données du back
function fetchData() {
  fetch('http://localhost:5678/api/works/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json(); // Transforme la réponse en JSON
    })
    .then(data => {
      // Appel de la fonction pour afficher la galerie avec les données récupérées
      itemGallery(data);
      filtreBtns(data); // Appel pour créer les boutons de filtre
    })
    .catch(error => {
      // Attrape les erreurs de requête ou de traitement des données
      console.error('Erreur:', error);
    });
}

// Fonction pour afficher la galerie avec les catégories et créer les boutons de filtre
function itemGallery(data) {
  const parentItemGallery = document.querySelector('.gallery');

  data.forEach(item => {
    // Création des items 
    const figureItemGallery = document.createElement('figure');
    parentItemGallery.appendChild(figureItemGallery);

    // Intégration des images
    const imageItemGallery = document.createElement('img');
    imageItemGallery.src = item.imageUrl;
    imageItemGallery.setAttribute('alt', item.title);
    figureItemGallery.appendChild(imageItemGallery);

    // Intégration des captions
    const captionItemGallery = document.createElement('figcaption');
    captionItemGallery.innerHTML = item.title;
    figureItemGallery.appendChild(captionItemGallery);

    // Intégration des catégories
    figureItemGallery.setAttribute('data-category', item.category.name.toLowerCase());
  });
}

// Fonction pour créer les boutons de filtre
function filtreBtns(data) {
  const categories = new Set(data.map(item => item.category.name.toLowerCase()));
  const filtersContainer = document.getElementById('filters');

  // Création du bouton "Tous"
  const btnTous = document.createElement('button');
  btnTous.classList.add('filter-button');
  btnTous.textContent = 'Tous';
  filtersContainer.appendChild(btnTous);

  // Fonction pour filtrer la galerie en fonction de la catégorie sélectionnée
  function filtreGallery(category) {
    const figures = document.querySelectorAll('.gallery figure');
    figures.forEach(figure => {
      const figureCategory = figure.getAttribute('data-category');
      if (category === 'all') {
        figure.classList.remove('off');
      } else {
        if (figureCategory === category) {
          figure.classList.remove('off');
        } else {
          figure.classList.add('off');
        }
      }
    });

    // Mettre à jour la classe active du bouton sélectionné
    var tousLesfiltres = document.querySelectorAll('.filter-button');
    tousLesfiltres.forEach(function(bouton) {
      bouton.classList.remove('active');
      if (bouton.getAttribute('data-category') === category) {
        bouton.classList.add('active');
      }
    });
  }

  // Action du bouton "Tous"
  btnTous.addEventListener('click', function() {
    const category = 'all'; // Définition de la catégorie pour le bouton "Tous"
    filtreGallery(category);
  });

  // Création des boutons pour chaque catégorie de filtre
  categories.forEach(category => {
    const filtreBtn = document.createElement('button');
    filtreBtn.classList.add('filter-button');
    filtreBtn.setAttribute('data-category', category);
    filtreBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filtersContainer.appendChild(filtreBtn);

    // Action pour chaque bouton de filtre
    filtreBtn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      filtreGallery(category);
    });
  });
}

// Appel de la fonction pour récupérer les données et afficher la galerie
fetchData();
