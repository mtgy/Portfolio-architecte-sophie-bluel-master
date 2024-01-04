import { fetchData, fetchCategory, matchCategoriesToWorks } from './appelAPI.js';
import { itemGallery, filtreBtns } from './gallery.js';
import './login.js';

import { initializeModalGallery, openModal, closeModal, stopPropagation } from './modalFunctions.js';



let imagesData = [];
let categorieData = [];

async function initialize() {
  try {
    
    imagesData = await fetchData();
    console.log('Data fetched successfully:', imagesData); 


    categorieData = await fetchCategory();
    console.log('Categories fetched successfully:', categorieData); // Ajoutez ce console.log pour afficher les catégories récupérées
    
    matchCategoriesToWorks(imagesData, categorieData);
    itemGallery(imagesData);
    filtreBtns(imagesData);
    initializeModalGallery(imagesData);

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

initialize();



