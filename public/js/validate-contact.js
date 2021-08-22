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

const validateForm = () => {
  const formFieldsArr = gatherFormFields("#contact-form");
  const inValidFieldsArr = [];

  if (formFieldsArr[formFieldsArr.length - 2].value != "") {
    return false;
  }
  //console.log(formFieldsArr);
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
