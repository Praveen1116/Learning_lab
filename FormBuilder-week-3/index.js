const fieldTypeSelect = document.querySelector("#fieldType");
const addFieldBtn = document.getElementById("addFieldBtn");
const previewArea = document.getElementById("previewArea");

addFieldBtn.addEventListener("click", () => {
    let previewDiv = document.createElement("div");
    previewDiv.className = "preview";

    if (fieldTypeSelect.value === "text") {
        const newLabel = document.createElement("label");
        newLabel.textContent = "Text Input: ";

        const newTextarea = document.createElement("textarea");
        newTextarea.className = "textArea";

        newLabel.appendChild(newTextarea);
        previewDiv.appendChild(newLabel);
    }
    else if (fieldTypeSelect.value === "checkbox") {
        const newLabel = document.createElement("label");
        const newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newLabel.appendChild(newCheckbox);
        newLabel.appendChild(document.createTextNode(" Checkbox"));
        previewDiv.appendChild(newLabel);
    }
    else if (fieldTypeSelect.value === "radio") {
        const newLabel = document.createElement("label");
        const newRadio = document.createElement("input");
        newRadio.type = "radio";
        newLabel.appendChild(newRadio);
        newLabel.appendChild(document.createTextNode(" Radio Button"));
        previewDiv.appendChild(newLabel);
    }

    previewArea.appendChild(previewDiv);
});