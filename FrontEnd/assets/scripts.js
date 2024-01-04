let imagesData = []; // Variable globale pour stocker les données d'images
let categorieData = []; // Variable globale pour stocker les données de catégories

// Fonction de récupération des données du back
function fetchData() {
  fetch('http://localhost:5678/api/works/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      return response.json();
    })
    .then(data => {
      imagesData = data.map(item => ({
        id: item.id,
        imageUrl: item.imageUrl,
        imageTitle: item.title,
        categoryId: item.categoryId,
        categoryName: item.category.name.toLowerCase()
      }));
      itemGallery(imagesData);
      filtreBtns(imagesData);
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
}

///fonction de recuperation des categories
function fetchCategory() {
  fetch('http://localhost:5678/api/categories/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur réseau categorie');
      }
      return response.json(); // Transforme la réponse en JSON
    })
    .then(data => {
      categorieData = data.map(categorie => ({
        id: categorie.id,
        categoryName: categorie.name.toLowerCase()
      }));

    })
    .catch(error => {
      console.error('Erreur:', error);
    });
}

Promise.all([fetchCategory(), fetchData()])
  .then(() => {
    matchCategoriesToWorks(imagesData, categorieData);
  })
  .catch(error => {
    console.error('Erreur:', error);
  });

function matchCategoriesToWorks(imagesData, categorieData) {
  imagesData.forEach(image => {
    const matchingCategory = categorieData.find(
      category => category.id === image.categoryId
    );

    if (matchingCategory) {
      image.categoryName = matchingCategory.categoryName.toLowerCase();
    } else {
      image.categoryName = 'Unknown';
    }
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
    imageItemGallery.setAttribute('alt', item.imageTitle);
    figureItemGallery.appendChild(imageItemGallery);

    // Intégration des captions
    const captionItemGallery = document.createElement('figcaption');
    captionItemGallery.innerHTML = item.imageTitle;
    figureItemGallery.appendChild(captionItemGallery);

    // Intégration des catégories
    figureItemGallery.setAttribute('data-category', item.categoryName);
  });
}

// les boutons de filtre
function filtreBtns(data) {
  const categories = new Set(data.map(item => item.categoryName));
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

  // bouton "Tous"
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







// bouton login-logout
document.addEventListener('DOMContentLoaded', function() {
  const userToken = localStorage.getItem('userToken');
  const logBtn = document.getElementById('userLoginBtn');
  const navPortModif = document.querySelector('nav.modifier');


  logBtn.addEventListener('click', function() {
      localStorage.removeItem('userToken');
      window.location.href = "login.html"; // la redirection
  });

  if (userToken) {
      // qd est connecté
      alert("Vous êtes connecté !");
      
      //modification du nom du btn
      logBtn.innerHTML = "logout";

      //apparition du btn modifier
      navPortModif.style.display = 'block';


  } else {
      // qd n'est pas connecté
      console.log("Utilisateur pas connecté !");
      logBtn.textContent = "login";
      navPortModif.style.display = 'none';
  }


});




/// boite modale

let modal = null
//pour les focus des touches
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
let previouslyFocusedElement = null
//chargement des elements
let modalImagesContainer = null;
let galleryFigures = null;




const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute('href'));

  // Récupérer les éléments de la galerie depuis la classe 'gallery'
  galleryFigures = document.querySelectorAll('.gallery figure');

  // Afficher les données de la première image de la galerie dans la console
  if (galleryFigures.length > 0) {
    const firstImageData = imagesData[0];
    console.log(firstImageData.imageUrl); // Affiche l'URL de l'image de la première figure
    console.log(firstImageData.imageTitle); // Affiche le titre de la première figure

    // Sélectionner le conteneur d'images de la modale
    modalImagesContainer = modal.querySelector('.modal-images');

    // Effacer le contenu existant du conteneur modal
    modalImagesContainer.innerHTML = '';

    // Vous pouvez maintenant itérer sur les images de la galerie et les afficher dans la boîte modale
    galleryFigures.forEach((figure, index) => {
      const imageData = imagesData[index];

      // Créer un élément figure pour chaque image
      const figureItemModal = document.createElement('figure');

      // Intégration des images
      const imageItemModal = document.createElement('img');
      imageItemModal.src = imageData.imageUrl;
      imageItemModal.alt = imageData.imageTitle;
      figureItemModal.appendChild(imageItemModal);


      // Intégration des catégories
      figureItemModal.setAttribute('data-category', imageData.categoryName);

      // Ajouter la figure à la modale
      modalImagesContainer.appendChild(figureItemModal);

      //ajout du bouton delete
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      figureItemModal.appendChild(deleteButton);
    
      // Gestion de l'événement de suppression
      deleteButton.addEventListener('click', function() {
        // Récupérer l'index de l'image à supprimer
        const indexToRemove = index;
      
        // Supprimer l'image correspondante de la galerie
        imagesData.splice(indexToRemove, 1); // Supprime l'image de imagesData
      
        // Retirer l'élément HTML de l'image correspondante de la galerie
        modalImagesContainer.removeChild(figureItemModal);
      
        // Rafraîchir la galerie avec les images restantes
        refreshGallery();
      });

    });

    ///le focus
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus')
    focusables[0].focus()
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  }
};



const closeModal = function (e) {
  if (modal === null) return
  if (previouslyFocusedElement !== null ) previouslyFocusedElement.focus()
  e.preventDefault();
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 500)
  refreshGallery()
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

}

const stopPropagation = function(e) {
  e.stopPropagation()
}

const focusInModal = function(e) {
  e.preventDefault();
  let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
  if (e.shiftkey === true) {
    index--
  } else {
  index++
  }
  if (index >= focusables.length) {
    index = 0 
  }
  if (index <0 ){
   index =  focusables.length -1
    }
  focusables[index].focus()
}
 

function refreshGallery() {
  // Sélectionner le conteneur de la galerie principale
  const parentItemGallery = document.querySelector('.gallery');

  // Effacer la galerie existante
  parentItemGallery.innerHTML = '';

  // Réafficher les images restantes
  imagesData.forEach(item => {
    const figureItemGallery = document.createElement('figure');
    parentItemGallery.appendChild(figureItemGallery);

    const imageItemGallery = document.createElement('img');
    imageItemGallery.src = item.imageUrl;
    imageItemGallery.setAttribute('alt', item.imageTitle);
    figureItemGallery.appendChild(imageItemGallery);

    const captionItemGallery = document.createElement('figcaption');
    captionItemGallery.innerHTML = item.imageTitle;
    figureItemGallery.appendChild(captionItemGallery);

    figureItemGallery.setAttribute('data-category', item.categoryName);
  });
}

// Fonction de suppression d'une image de la galerie
function deleteImage(indexToRemove) {
  imagesData.splice(indexToRemove, 1);
  refreshModalImages(); // Mettre à jour la boîte modale après la suppression
  refreshGallery(); // Rafraîchir également la galerie principale
}

// Fonction pour afficher les images dans la boîte modale
function refreshModalImages() {
  modalImagesContainer.innerHTML = '';

  imagesData.forEach((image, index) => {
    const figureItemModal = document.createElement('figure');
    const imageItemModal = document.createElement('img');
    imageItemModal.src = image.imageUrl;
    imageItemModal.alt = image.imageTitle;
    figureItemModal.appendChild(imageItemModal);
    figureItemModal.setAttribute('data-category', image.categoryName);

    // Ajout du bouton de suppression
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    figureItemModal.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
      const imageId = imagesData[index].id; // Récupérer l'ID de l'image à supprimer
    
      // Envoyer une requête DELETE pour supprimer l'image du serveur
      fetch(`http://localhost:5678/api/works/${imageId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'image');
          }
          return response.json();
        })
        .then(() => {
          deleteImageAndUpdateGallery(index); // Appeler la fonction pour mettre à jour les données après suppression
        })
        .catch(error => {
          console.error('Erreur:', error);
          // Gérer l'erreur, si nécessaire
        });
    });
    
    function deleteImageAndUpdateGallery(indexToRemove) {
      // Supprimer l'image des données locales après la suppression réussie sur le serveur
      const deletedImage = imagesData.splice(indexToRemove, 1)[0];
     
      // Mettre à jour la boîte modale
      refreshModalImages();
    
      // Mettre à jour la galerie principale
      refreshGallery();
    
      // Log de confirmation de la mise à jour de la base de données
      console.log(`Image ${deletedImage.id} supprimée de la base de données`);
    
      // Autre logique si nécessaire avec deletedImage
    }

    modalImagesContainer.appendChild(figureItemModal);
  });
}





document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);

})

window.addEventListener('keydown', function(e) {
 if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
 }

 if(e.key === 'Tab' && modal !== null) {
  focusInModal(e)
 }
})