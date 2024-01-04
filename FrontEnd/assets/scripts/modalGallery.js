import { fetchData, supprimerWork } from './appelAPI.js';

async function afficherGalerieDansModal() {
    try {
        // titre
        // Modification du titre
        const modalTitle = "Galerie photo"; // Définissez ici le titre souhaité
        const titleModal = document.querySelector('#titlemodal');
        titleModal.textContent = modalTitle;


        const imagesData = await fetchData();
        const modalImagesContainer = document.querySelector('.modal-images');
        
        modalImagesContainer.innerHTML = '';
        
        imagesData.forEach((imageData) => {
            const figureElement = creerElementFigure(imageData);
            modalImagesContainer.appendChild(figureElement);
        });
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la modale:', error);
    }
}

function creerElementFigure(imageData) {
    const figureElement = document.createElement('figure');
    const imageElement = creerElementImage(imageData);
    
    figureElement.appendChild(imageElement);
    figureElement.setAttribute('data-category', imageData.categoryName);
    
    ajouterBoutonSuppression(figureElement, imageData.id);
    return figureElement;
}

function creerElementImage(imageData) {
    const imageElement = document.createElement('img');
    imageElement.src = imageData.imageUrl;
    imageElement.alt = imageData.imageTitle;
    return imageElement;
}

function ajouterBoutonSuppression(figureElement, imageId) {
    const deleteButton = creerBoutonSuppression();
    figureElement.appendChild(deleteButton);

    deleteButton.addEventListener('click', async function() {
        await gererSuppression(imageId);
    });
}

function creerBoutonSuppression() {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    return deleteButton;
}

async function gererSuppression(imageId) {
    console.log('ID de l\'image à supprimer:', imageId);
    try {
        const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?');
        
        if (confirmation) {
            const response = await supprimerWork(imageId);
            gererReponseSuppression(response);
        } else {
            console.log('Suppression annulée par l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
      
    }
}

async function gererReponseSuppression(response) {
    if (response) {
        console.log('Image supprimée avec succès:', response);
        try {
            const updatedImagesData = await fetchData();
            afficherGalerieDansModal(updatedImagesData);

           
            const deletedImageElement = document.querySelector(`[data-id="${response.id}"]`);
            if (deletedImageElement) {
                deletedImageElement.remove();
            } else {
                console.log('L\'élément correspondant à l\'image supprimée n\'a pas été trouvé dans le DOM.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données actualisées:', error);
        }
    } else {
        console.log('La suppression de l\'image a échoué');
    }
}






export { afficherGalerieDansModal };
