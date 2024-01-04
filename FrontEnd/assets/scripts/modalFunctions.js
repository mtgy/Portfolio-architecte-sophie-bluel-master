
import { afficherGalerieDansModal } from './modalGallery.js';
import { afficherFormulaire} from './formAddNew.js';

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = [];
let previouslyFocusedElement = null;
let modalImagesContainer = null;
let galleryFigures = null;

function openModal(e, imagesData) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute('href'));
  galleryFigures = document.querySelectorAll('.gallery figure');

  if (galleryFigures.length > 0) {
    afficherGalerieDansModal();
  }


  //le bouton add new pic
  addAddPhotoButton(); 




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
 
};



const closeModal = function (e) {
  if (modal === null) return
  if (previouslyFocusedElement !== null ) previouslyFocusedElement.focus()
  e.preventDefault();
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 500)
 
  initializeModalClose();
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
 



function initializeModalGallery(imagesData) {
    document.querySelectorAll('.js-modal').forEach(a => {
      a.addEventListener('click', (e) => openModal(e, imagesData));
    });
  
    window.addEventListener('keydown', function (e) {
      if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
      }
  
      if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
      }
    });
  }
  

  function addAddPhotoButton() {
    const addPhotoButton = document.createElement('button');
    addPhotoButton.textContent = 'Ajouter une photo';
    addPhotoButton.classList.add('addNewPic');
  


    addPhotoButton.addEventListener('click', afficherFormulaire);
  
    const modalWrapper = document.querySelector('.modal-wrapper');
    modalWrapper.appendChild(addPhotoButton);
  }



  function initializeModalClose() {


    /// reinitilise la modal-image
    const modalImages = document.querySelector('.modal-images');
    const modalForm = document.querySelector('.modal-form');

    if (modalForm) {
       
        modalForm.classList.remove('modal-form');
        modalForm.classList.add('modal-images');
    } else if (!modalImages && !modalForm) {
      
        creerModalAvecTitreDynamique(); 
    }

    // suppression des boutons 
    //le bouton add
    const addPhotoButton = modal.querySelector('.addNewPic');
    if (addPhotoButton) {
      addPhotoButton.remove();
    }
    const backButton = modal.querySelector('.backButton');
    if ( backButton) {
      backButton.remove();
    }




  }






  export {
    initializeModalClose,
    initializeModalGallery,
    openModal,
    addAddPhotoButton, 
    closeModal,
    stopPropagation,

  };