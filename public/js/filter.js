const FILTER_SELECTOR = "js-filter";
const CATEGORY_PARENT_SELECTOR = "js-cat-container";

const getCategories = () => {
  const catArray = [];
  const categories = document.querySelectorAll(
    `.${CATEGORY_PARENT_SELECTOR} span[title]`
  );

  categories.forEach((category) => {
    const categoryTitle = category.title.split(" ")[0].toString();
    if (catArray.indexOf(categoryTitle) == -1) {
      catArray.push(categoryTitle);
    }
  });

  return catArray;
};

const addProjectCategories = () => {
  const categoryContainers = document.querySelectorAll(
    `.${CATEGORY_PARENT_SELECTOR} `
  );

  categoryContainers.forEach((container) => {
    for (child of container.children) {
      container.parentElement.classList.add(
        child.title.split(" ")[0].toLowerCase()
      );
    }
  });
};

const allCategories = getCategories();

const addFilters = (arr) => {
  const filterParent = document.querySelector(`.${FILTER_SELECTOR}`);
  filterParent.innerHTML = arr
    .map((item) => {
      return `<button class="btn btn-outline-secondary m-1" data-filter="${item}">${item}</button>`;
    })
    .join("");
};

addProjectCategories();
addFilters(allCategories);
