import { sendFormData,  fetchCategory  } from './appelAPI.js';
import {  initializeModalClose, addAddPhotoButton } from './modalFunctions.js';
import { afficherGalerieDansModal } from './modalGallery.js';


async function envoyerFormulaire(form, formattedData) {
    try {
        await sendFormData(formattedData); 
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIwNDE2MSwiZXhwIjoxNzA0MjkwNTYxfQ.k9ri0X1ARLaHjiBriXHa5qx1mOJEBfbPbm15IzDeX0A', // Remplacez avec votre authentification
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête POST');
        }

        console.log('Données envoyées avec succès !');
        
    } catch (error) {

        console.error('Erreur lors de l\'envoi des données depuis envoyerFormulaire:', error);
    }
}


async function afficherFormulaire() {
    const addPhotoButton = document.querySelector('.addNewPic');
    
    addPhotoButton.removeEventListener('click', null);
    const modalImagesContainer = document.querySelector('.modal-images');
    modalImagesContainer.innerHTML = '';
    modalImagesContainer.classList.add('modal-form');
    modalImagesContainer.classList.remove('modal-images');

    const titleModal = document.querySelector('#titlemodal');
    titleModal.textContent = 'Ajout photo'; // Nouveau titre



    // Création du formulaire
    const formElement = document.createElement('form');
    formElement.innerHTML = `
        <div class="champImg">
            <i class="fa-regular fa-image"></i>
            <label for="imageFile" class="custom-file-upload">+ Ajouter photo</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/jpeg, image/png" required>
            <p>jpg, png : 4mo max</p>
        </div>
        <label for="imageTitle">Titre</label>
        <input type="text" id="imageTitle" name="imageTitle" required><br>
        <label for="imageCategory">Catégorie :</label>
        <select id="imageCategory" name="imageCategory" required>
            <option value="" disabled selected></option>

        </select>
    `;


    modalImagesContainer.appendChild(formElement);


    const imageFileInput = document.getElementById('imageFile');
    afficherApercuImage(imageFileInput, formElement); 
    
     addPhotoButton.textContent = 'Valider';

    //  bouton "Valider"
    addPhotoButton.addEventListener('click', async () => {
        const formData = new FormData(document.querySelector('form'));
        const formattedData = {
            imageTitle: formData.get('imageTitle'),
            imageCategory: formData.get('imageCategory'),
          
        };

        console.log('Données du formulaire à envoyer :', formattedData);

        await envoyerFormulaire(form, formattedData);
    });



    checkFormValidity();
    formElement.addEventListener('input', checkFormValidity);
    
    // la taille du fichier
    imageFileInput.addEventListener('change', function() {
        checkFileSize(this);
    });
    

    const form = document.querySelector('form');
    envoyerFormulaire(form);

    
    // bouton "Retour"
    const backButton = creerBtnRetour();
    const modalWrapper = document.querySelector('.modal-wrapper');        
    modalWrapper.insertBefore(backButton, titleModal);



    ajouterRetourListener();

//categorie 
const imageCategorySelect = document.getElementById('imageCategory');

  try {
    // Récupérez les catégories depuis l'API
    const categories = await fetchCategory();

    // Ajoutez les options de catégorie 
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id; 
      option.textContent = category.categoryName; 
      imageCategorySelect.appendChild(option);
    });
  } catch (error) {
   
    console.error('Erreur lors de la récupération des catégories:', error);
  }

//  bouton "Valider"
addPhotoButton.addEventListener('click', async () => {
    const formData = new FormData(document.querySelector('form'));
    const formattedData = {
        imageTitle: formData.get('imageTitle'),
        imageCategory: formData.get('imageCategory'),
      
    };

    console.log('Données du formulaire à envoyer :', formattedData);

    try {
        await envoyerFormulaire(form, formattedData);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du formulaire depuis le bouton "Valider":', error);
    }
});

}


//  vérifier la validité
function checkFormValidity() {
    const inputFields = document.querySelectorAll('input[required], select[required]');
    let allFieldsFilled = true;

    inputFields.forEach((inputField) => {
        if (!inputField.value.trim()) {
            allFieldsFilled = false;
        }
    });

    const addPhotoButton = document.querySelector('.addNewPic');
    addPhotoButton.disabled = !allFieldsFilled;
}

// taille du fichier
function checkFileSize(fileInput) {
    const maxSize = 4 * 1024 * 1024; 
    const file = fileInput.files[0];

    if (file) {
        if ((file.type === 'image/jpeg' || file.type === 'image/png') && file.size > maxSize) {
            alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier JPG ou PNG de taille inférieure à 4 Mo.');
            fileInput.value = ''; // Efface le fichier sélectionné
        }
    } else {
       console.log('aucuns fichier selectionner');
    }
}


function afficherApercuImage(fileInput) {
    const previewImage = document.createElement('img');
 

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                previewImage.src = event.target.result;

               
                const champImg = document.querySelector('.champImg');

              
                champImg.innerHTML = '';
                champImg.appendChild(previewImage);
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.src = '';
        }
    });
}





function creerBtnRetour() {
    const backButton = document.createElement('button');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.classList.add('backButton');
    return backButton;
}


function ajouterRetourListener() {
 
    const backButton = document.querySelector('.backButton');

    backButton.addEventListener('click', () => {
        const modalImagesContainer = document.querySelector('.modal-form');
        modalImagesContainer.innerHTML = ''; 
        
        initializeModalClose(); 
        
        afficherGalerieDansModal(); 
        console.log('retour');
        addAddPhotoButton();
    });
}






export { afficherFormulaire  };



