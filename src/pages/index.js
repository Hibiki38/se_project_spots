import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__post-btn");
const editModal = document.querySelector("#edit-modal");
const profileCloseButton = editModal.querySelector(".modal__close-btn");
const profileName = document.querySelector(".profile__name");
const description = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const editModalNameInput = editModal.querySelector("#name");
const editModalDescription = editModal.querySelector("#description");
const editFormElement = editModal.querySelector(".modal__form");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const cardSubmitButton = cardModal.querySelector(".modal__save-btn");
const cardModalForm = cardModal.querySelector(".modal__form");
const cardLinkInput = cardModal.querySelector("#add-card-link");
const cardNameInput = cardModal.querySelector("#caption");
const modalPreview = document.querySelector("#modal-preview");
const previewModalImage = modalPreview.querySelector(".modal__image");
const previewModalCaption = modalPreview.querySelector(".modal__caption");
const previewModalClose = modalPreview.querySelector(
  ".modal__close-btn_preview"
);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "db30717b-53e5-4eba-bda7-e732eff00e8d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, users]) => {
    console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    profileName.textContent = users.name;
    description.textContent = users.description;
    profileAvatar.src = users.avatar;
  })
  .catch((err) => {
    console.error(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardName = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-btn");

  cardName.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-btn_liked");
  });

  cardImage.addEventListener("click", () => {
    openModal(modalPreview);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    if (activeModal) closeModal(activeModal);
  }
}

function handleClickOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
  modal.addEventListener("mousedown", handleClickOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("mousedown", handleClickOverlay);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescription.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      description.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
}

function handleAddNewCard(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  api
    .addNewCard(inputValues)
    .then((cardData) => {
      const cardEl = getCardElement(cardData);
      cardsList.prepend(cardEl);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error(err);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescription.value = description.textContent;
  openModal(editModal);
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescription],
    settings
  );
});

profileCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});
editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardModalForm.addEventListener("submit", handleAddNewCard);

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});
previewModalClose.addEventListener("click", () => {
  closeModal(modalPreview);
});

enableValidation(settings);
