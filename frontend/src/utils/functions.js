const toggleModal = () => {
	const modal = document.getElementById("modalTarefa");
	if (modal.classList.contains("hidden")) {
		modal.classList.remove("hidden");
	} else {
		modal.classList.add("hidden");
	}
};

export default toggleModal;
