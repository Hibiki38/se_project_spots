export function setButtontext(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}

export function setDeleteButtontext(
  btn,
  isDeleting,
  defaultText = "Delete",
  deletingText = "Deleting..."
) {
  if (isDeleting) {
    btn.textContent = deletingText;
  } else {
    btn.textContent = defaultText;
  }
}
