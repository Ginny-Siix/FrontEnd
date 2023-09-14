const galleryConteneurElement = document.querySelector(".gallery");
const filtresConteneurElement = document.querySelector(".filtres");
const adminPanelElement = document.querySelector(".admin_panel");
const boutonDeclencheurModal = document.querySelector(".project-modal");
const mainModalOverlayElement = document.querySelector(".main-modal-overlay");
const modalButtonPhotoElement = document.querySelector(".modal_footer-button");
const modalPhotoElement = document.querySelector(".modal_photo");
const closeModalElement = document.querySelector(".close_modal");
const close_modal2 = document.querySelector(".close_modal2");
const mainModalContenuElement = document.querySelector(".main-modal-contenu");
const formulaire_photo = document.querySelector(".formulaire-photo");
const img_preview = document.querySelector(".img_preview");
const button_formulaire_photo = document.querySelector(".formulaire-photo button");
const input_image = document.querySelector("#input_image");
const input_title = document.querySelector("#input_title");
const input_category = document.querySelector("#input_category");
const leftArrowElement = document.querySelector('.left-arrow');

let works = [];
let categories = [];
const isLogged = sessionStorage.getItem("token") || null;

const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => data.forEach((item) => works.push(item)));
};

const getCategories = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => data.forEach((item) => categories.push(item)));
};

const createWorks = (works) => {
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");

    img.classList.add("gallery_image");


    figcaption.textContent = work.title;
    img.src = work.imageUrl;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    galleryConteneurElement.appendChild(figure);
  });
};

const createButton = (dataForButton) => {
  const button = document.createElement("button");
  button.textContent = dataForButton.name;
  button.name = dataForButton.id;

  if (dataForButton.id === 0) {
    button.classList.add("test");
  }

  button.addEventListener("click", () => {
    const tousLesBoutons = document.querySelectorAll(".filtres button");
    tousLesBoutons.forEach((bouton) => bouton.classList.remove("test"));
    button.classList.add("test");
    if (dataForButton.id === 0) {
      galleryConteneurElement.innerHTML = "";
      createWorks(works);
    } else {
      const worksFiltrés = works.filter(
        (work) => work.categoryId === dataForButton.id
      );
      galleryConteneurElement.innerHTML = "";
      createWorks(worksFiltrés);
    }
  });

  filtresConteneurElement.appendChild(button);
};

const gererFiltres = (dataDesCategories) => {
  createButton({ id: 0, name: "Tous" });
  categories.forEach((categorie) => {
    createButton(categorie);
  });
};

const createWorksModal = (data) => {
  data.forEach((work) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const trash = document.createElement("img");
    const trashConteneur = document.createElement("span");
    const p = document.createElement("p");

    img.classList.add("modal-img");
    img.src = work.imageUrl;
    p.textContent = "éditer";

    trashConteneur.classList.add("trash-conteneur");
    trash.src = "./assets/icons/trash.svg";

    trashConteneur.appendChild(trash);

    trashConteneur.addEventListener("click", async () => {
      const response = await supprimerWork(work.id);

      if (response.status === 204) {
        majHTML();
      }
    });

    div.append(img, trashConteneur, p);
    mainModalContenuElement.appendChild(div);
  });
};

const supprimerWork = async (id) => {
  return await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${isLogged}`,
    },
  });
};

const addPhoto = async (data) => {
  return await fetch("http://localhost:5678/api/works/", {
    method: "post",
    headers: {
      Authorization: `Bearer ${isLogged}`,
    },
    body: data,
  });
};

const majHTML = async () => {
  works = [];
  galleryConteneurElement.innerHTML = "";
  mainModalContenuElement.innerHTML = "";

  await getWorks();
  createWorks(works);
  createWorksModal(works);
};

const init = async () => {
  await getWorks();
  await getCategories();
  createWorks(works);
  gererFiltres();
  createWorksModal(works);
};

init();

if (isLogged !== null) {
  adminPanelElement.style.display = "flex";
  boutonDeclencheurModal.style.display = "inline-block";
  filtresConteneurElement.style.display = "none"

  boutonDeclencheurModal.addEventListener("click", () => {
    mainModalOverlayElement.style.display = "flex";
  });
}

modalButtonPhotoElement.addEventListener("click", () => {
  mainModalOverlayElement.style.display = "none";
  modalPhotoElement.style.display = "flex";
});

closeModalElement.addEventListener("click", () => {
  mainModalOverlayElement.style.display = "none";
});

leftArrowElement.addEventListener('click', () => {
  const img = document.querySelector(".img_preview")
    
  img.src = "./assets/icons/photo.svg";
    img.classList.remove('active')
    document.querySelector('.label-image').style.display = 'block'
    document.querySelector('.img_preview_container p').style.display = 'block'
formulaire_photo.reset();
button_formulaire_photo.style.background = "grey";
button_formulaire_photo.setAttribute("disabled", "");
  mainModalOverlayElement.style.display = "flex";
  modalPhotoElement.style.display = "none";
})

input_image.addEventListener("change", previeuwFile);

function previeuwFile() {
  const file_extention_regex = /\.(jpe?g|gif|png)$/i;

  if (
    this.files.length === 0 ||
    !file_extention_regex.test(this.files[0].name)
  ) {
    return;
  }

  const file = this.files[0];
  const imageUrl = URL.createObjectURL(this.files[0]);

  img_preview.src = imageUrl;
  img_preview.classList.add('active')
  document.querySelector('.label-image').style.display = 'none'
  document.querySelector('.img_preview_container p').style.display = 'none'
}

formulaire_photo.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(formulaire_photo);

  const response = await addPhoto(data);

  if (response.status === 201) {
    const img = document.querySelector(".img_preview")
    
    img.src = "./assets/icons/photo.svg";
      img.classList.remove('active')
    formulaire_photo.reset();
    document.querySelector('.label-image').style.display = 'block'
    document.querySelector('.img_preview_container p').style.display = 'block'
    button_formulaire_photo.style.background = "grey";
    button_formulaire_photo.setAttribute("disabled", "")
    modalPhotoElement.style.display = "none";
    majHTML();
  }
});

close_modal2.addEventListener("click", () => {
  const img = document.querySelector(".img_preview")
    
  img.src = "./assets/icons/photo.svg";
    img.classList.remove('active')
    document.querySelector('.label-image').style.display = 'block'
    document.querySelector('.img_preview_container p').style.display = 'block'
formulaire_photo.reset();
button_formulaire_photo.style.background = "grey";
button_formulaire_photo.setAttribute("disabled", "");
  modalPhotoElement.style.display = "none";
  button_formulaire_photo.style.background = "grey";
});

// //                                    exercice du 22/08/23
// // faire en sorte que le bouton disabled soit de nouveau actif seulement si les 3 information sont renseigné : photo, title et category


// // /!\ cibler les 3 inputs puis ajout un listener avec 'change', et à chaque fois appeller la fonction juste en dessous
formulaire_photo.addEventListener("change", () => {

  if (
    input_image.value != "" &&
    input_title.value != "" &&
    input_category.value != 0
  ) {
    button_formulaire_photo.style.background = "#1d6154";
    button_formulaire_photo.removeAttribute("disabled", "");

    // // // si different des valeurs de base, on change le bouton de submit || couleur + attribut disabled enlevé
  } else {
    button_formulaire_photo.style.background = "grey";
    button_formulaire_photo.setAttribute("disabled", "");
  }
});


