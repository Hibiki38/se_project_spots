import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";

import Api from "../utils/Api.js";

import { setButtontext, setDeleteButtontext } from "../utils/helpers.js";

const editModal = document.querySelector("#edit-modal");
const editModalNameInput = editModal.querySelector("#name");
const editModalDescription = editModal.querySelector("#description");
const editFormElement = editModal.querySelector(".modal__form");

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAvatar = document.querySelector(".profile__avatar");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileCloseButton = editModal.querySelector(".modal__close-btn");
const profileName = document.querySelector(".profile__name");
const cardModalButton = document.querySelector(".profile__post-btn");
const description = document.querySelector(".profile__description");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = cardModal.querySelector(".modal__close-btn");
const cardSubmitButton = cardModal.querySelector(".modal__save-btn");
const cardModalForm = cardModal.querySelector(".modal__form");
const cardLinkInput = cardModal.querySelector("#add-card-link");
const cardNameInput = cardModal.querySelector("#caption");
let selectedCard;
let selectedCardId;

const modalPreview = document.querySelector("#modal-preview");
const previewModalImage = modalPreview.querySelector(".modal__image");
const previewModalCaption = modalPreview.querySelector(".modal__caption");
const previewModalClose = modalPreview.querySelector(
  ".modal__close-btn_preview"
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitButton = avatarModal.querySelector(".modal__save-btn");
const avatarModalForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#edit-avatar");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCloseButton = deleteModal.querySelector(".modal__close-btn");
const cancelDeleteButton = deleteModal.querySelector(".modal__save-btn_cancel");

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

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-btn_liked");
  }

  cardName.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardLikeButton.addEventListener("click", (evt) =>
    handleIsLiked(evt, data._id)
  );

  cardImage.addEventListener("click", () => {
    openModal(modalPreview);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
    selectedCardId = data._id;
  });

  return cardElement;
}

function handleIsLiked(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-btn_liked");
  api
    .handleLike(id, isLiked)
    .then((data) => {
      evt.target.classList.toggle("card__like-btn_liked", data.isLiked);
    })
    .catch(console.error);
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
  const submitBtn = evt.submitter;
  setButtontext(submitBtn, true);
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
    .catch(console.error)
    .finally(() => {
      setButtontext(submitBtn, false);
    });
}

function handleAddNewCard(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const submitBtn = evt.submitter;
  setButtontext(submitBtn, true);
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
    })
    .finally(() => {
      setButtontext(submitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtontext(submitBtn, true);
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarModalForm.reset();
      disableButton(avatarSubmitButton, settings);
    })
    .catch(console.error)
    .finally(submitBtn, false);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setDeleteButtontext(submitBtn, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(submitBtn, false);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
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

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

avatarModalForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
