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
    //creation des items 
    const figureItemGallery = document.createElement('figure');
    parentItemGallery.appendChild(figureItemGallery);

    // integration des images
    const imageItemGallery = document.createElement('img');
    imageItemGallery.src = item.imageUrl;
    imageItemGallery.setAttribute('alt', item.title);
    figureItemGallery.appendChild(imageItemGallery);

    // integration des captions
    const captionItemGallery = document.createElement('figcaption');
    captionItemGallery.innerHTML = item.title;
    figureItemGallery.appendChild(captionItemGallery);

    //integration des categories

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

///action du btn tous
  btnTous.addEventListener('click', function() {
  const category = 'all'; // Définition de la catégorie pour le bouton "Tous"
  filtreGallery(category);
});

// boutons categorie filtre
  categories.forEach(category => {
    const filtreBtn = document.createElement('button');
    filtreBtn.classList.add('filter-button');
    filtreBtn.setAttribute('data-category', category);
    filtreBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    filtersContainer.appendChild(filtreBtn);

    filtreBtn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
       filtreGallery(category);
    });
    
  });
/// fonctionnement des boutons de filtre de la galerie
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
  }
 
  
  
}

// Appel de la fonction pour récupérer les données et afficher la galerie
fetchData();
