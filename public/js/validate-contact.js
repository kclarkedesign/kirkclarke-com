const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // check fields - frontend
  if (isFormValid) {
    // check fields - backend
    validateFields();
  }
});

const validateFields = () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit");
  const formData = new FormData(form);
  submitBtn.innerHTML = "Submitting&hellip;";
  grecaptcha.ready(function () {
    grecaptcha
      .execute("6LdGAhocAAAAAFZKVSDhNzbo0VxKl6jbiWEocrQM", { action: "submit" })
      .then(function (token) {
        formData.append("g-recaptcha-response", token);
        // async xmlHttpRequest
        const request = new XMLHttpRequest();
        request.open("POST", "contact.php");
        request.onload = (e) => {
          if (request.readyState === 4) {
            const respTxt = JSON.parse(request.responseText);
            const respTxtType = respTxt.type;

            // if (request.status === 200) {
            //   respTxt = JSON.parse(request.responseText);
            // } else {
            //   respTxt = JSON.parse(request.responseText);
            // }
            document.activeElement.blur();
            submitBtn.innerText = respTxt.resp;
            submitBtn.classList.add("alert-" + respTxtType);

            setTimeout(() => {
              submitBtn.classList.remove("alert-" + respTxtType);
              submitBtn.innerText = "Submit";
            }, 5000);
          }
        };
        request.send(formData);
      });
  });
};

const gatherFormFields = (formId) => {
  const form = document.querySelector(formId);
  const isValid = form.checkValidity();
  //console.log(isValid);
  return Array.from(form.elements);
};

const validateTextField = (elem) => {
  if (elem.name == "choices") {
    return true;
  }
  return elem.value != "" ? true : false;
};

const validateEmailField = (elem) => {
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
    email.value
  );
};

const isFormValid = () => {
  const formFieldsArr = gatherFormFields("#contact-form");
  const inValidFieldsArr = [];

  if (formFieldsArr[formFieldsArr.length - 2].value != "") {
    return false;
  }

  let isValid = true;

  for (const field of formFieldsArr) {
    if (field.name == "choices" && field.value != "") {
      isValid = false;
      return;
    }
    const fieldType = field.type;
    let isFieldValid = false;

    switch (fieldType) {
      case "text":
        isFieldValid = validateTextField(field);
        break;
      case "email":
        isFieldValid = validateEmailField(field);
        break;
      case "textarea":
        isFieldValid = validateTextField(field);
        break;
      case "submit":
        isFieldValid = true;
        break;
    }

    if (!isFieldValid) {
      field.style.borderColor = "#c73e1d";
      inValidFieldsArr.push(field.name);
    }
  }
  if (inValidFieldsArr.length > 0) {
    isValid = false;
  }

  return isValid;
};
