const FILTER_SELECTOR = "js-filter";
const CATEGORY_PARENT_SELECTOR = "js-cat-container";
const FILTER_SELECTED_SELECTOR = "filter-selected";
const FILTERING_ACTIVE_SELECTOR = "filters-active";
const projectGrid = document.querySelector("o-grid--projects");
const projectTiles = document.querySelectorAll(".project-tile");
const activeFilters = [];
let tilesFilteredCount = 0;

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

const addFilters = (arr) => {
  const filterParent = document.querySelector(`.${FILTER_SELECTOR}`);
  filterParent.innerHTML = arr
    .map((item) => {
      return `<button class="btn btn-outline-secondary m-1" data-filter="${item}">${item}</button>`;
    })
    .join("");

  for (filter of filterParent.children) {
    filter.addEventListener("click", (e) => {
      handleFilter(e);
    });
  }
};

const handleFilter = (e) => {
  const filter = e.target;
  const FILTERED_SELECTOR = "filtered-out";
  const targetClass = filter.dataset.filter.toLowerCase();

  const checkTiles = (cssClass) => {
    projectTiles.forEach((tile) => {
      console.log(
        activeFilters.some((filter) => tile.classList.value.includes(filter))
      );
      if (
        !activeFilters.some((filter) => tile.classList.value.includes(filter))
      ) {
        tile.classList.add(cssClass);
      } else {
        tile.classList.remove(cssClass);
      }
    });
  };

  filter.classList.toggle(FILTER_SELECTED_SELECTOR);

  if (filter.classList.value.toLowerCase().includes(FILTER_SELECTED_SELECTOR)) {
    // add filter to activeFilters
    activeFilters.push(targetClass);
    checkTiles(FILTERED_SELECTOR);
  } else {
    // remove filter from activeFilters
    activeFilters.splice(activeFilters.indexOf(targetClass), 1);
    checkTiles(FILTERED_SELECTOR);
  }

  if (activeFilters.length == 0) {
    projectTiles.forEach((tile) => {
      tile.classList.remove(FILTERED_SELECTOR);
    });
  }

  console.log(activeFilters);
};

addProjectCategories();
addFilters(getCategories());
