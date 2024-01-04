export async function fetchData() {
  try {
    const response = await fetch('http://localhost:5678/api/works/');
    if (!response.ok) {
      throw new Error('Erreur réseau');
    }
    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      imageUrl: item.imageUrl,
      imageTitle: item.title,
      categoryId: item.categoryId,
      categoryName: item.category.name.toLowerCase()
    }));
  } catch (error) {
    console.error('Erreur fetchData:', error);
    return [];
  }
}

export async function fetchCategory() {
  
  try {
    const response = await fetch('http://localhost:5678/api/categories/');
    if (!response.ok) {
      throw new Error('Erreur réseau categorie');
    }
    const data = await response.json();
    return data.map(categorie => ({
      id: categorie.id,
      categoryName: categorie.name.toLowerCase()
    }));
  } catch (error) {
    console.error('Erreur fetchCategory:', error);
    return [];
  }
}


export function matchCategoriesToWorks(imagesData, categorieData) {
  imagesData.forEach(image => {
    const matchingCategory = categorieData.find(
      category => category.id === image.categoryId
    );

    if (matchingCategory) {
      image.categoryName = matchingCategory.categoryName.toLowerCase();
    } else {
      image.categoryName = 'Nulle';
    }
  });
}

export async function supprimerWork(imageId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIwNDE2MSwiZXhwIjoxNzA0MjkwNTYxfQ.k9ri0X1ARLaHjiBriXHa5qx1mOJEBfbPbm15IzDeX0A`,
        'Content-Type': 'application/json', 
   
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'image');
    }


    if (response.status === 204) {
      return { success: true }; 
    }

   
    return response.json();
  } catch (error) {
    console.error('Erreur:', error);
    
    return null;
  }
}

export async function sendFormData(formData) {
  try {
    const response = await fetch('http://localhost:5678/api/works/', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDIwNDE2MSwiZXhwIjoxNzA0MjkwNTYxfQ.k9ri0X1ARLaHjiBriXHa5qx1mOJEBfbPbm15IzDeX0A', // Remplacez avec votre authentification
        'Content-Type': 'application/json',
       
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du formulaire');
    }

    const data = await response.json();
    console.log('Réponse de création:', data);
  
  } catch (error) {
    console.error('Erreur:', error);

  }
}
