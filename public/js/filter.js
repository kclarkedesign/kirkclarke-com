const FILTER_SELECTOR = "js-filter";
const CATEGORY_PARENT_SELECTOR = "js-cat-container";
const FILTER_SELECTED_SELECTOR = "filter-selected";
const FILTERING_ACTIVE_SELECTOR = "filters-active";
const FILTER_RESET_SELECTOR = "js-filter-reset";
const DISPLAY_NONE_SELECTOR = "d-none";
const projectGrid = document.querySelector(".o-grid--projects");
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

const handleFilterReset = (e, resetId, arr) => {
  const filterReset = document.querySelector(`#${resetId}`);
  if (arr.length > 0) {
    filterReset.classList.remove(DISPLAY_NONE_SELECTOR);
  } else {
    filterReset.classList.add(DISPLAY_NONE_SELECTOR);
  }
};

const handleFilters = (arr, reset = false) => {
  const filterParent = document.querySelector(`.${FILTER_SELECTOR}`);

  if (reset == false) {
    filterParent.innerHTML = arr
      .map((item) => {
        return `<button class="btn btn-outline-secondary m-1" data-filter="${item}">${item}</button>`;
      })
      .join("");

    filterParent.innerHTML +=
      '<button id="js-filter-reset" class="btn btn-reset-filters btn-outline-secondary m-1 d-none" data-filter="reset">Reset filters</button>';

    for (filter of filterParent.children) {
      filter.addEventListener("click", (e) => {
        handleFilter(e);
        if (filter.id == FILTER_RESET_SELECTOR) {
          handleFilterReset(e, filter.id, activeFilters);
        }
      });
    }
  } else {
    // empty active filters array
    while (arr.length) {
      arr.pop();
    }
    // remove active filter class from filters
    for (filter of filterParent.children) {
      filter.classList.remove(FILTER_SELECTED_SELECTOR);
    }
  }
};

const handleFilter = (e) => {
  //TODO: update url and allow for filtering from query string
  const filter = e.target;
  const FILTERED_SELECTOR = "filtered-out";
  const targetClass = filter.dataset.filter.toLowerCase();

  const checkTiles = (cssClass, reset = false) => {
    projectTiles.forEach((tile) => {
      if (reset == false) {
        if (
          !activeFilters.some((filter) => tile.classList.value.includes(filter))
        ) {
          tile.classList.add(cssClass);
        } else {
          tile.classList.remove(cssClass);
        }
      } else {
        tile.classList.remove(cssClass);
      }
    });
  };
  // if reset
  if (filter.id == FILTER_RESET_SELECTOR) {
    handleFilters(activeFilters, true);
    checkTiles(FILTERED_SELECTOR, true);
    return;
  }

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
};

addProjectCategories();
handleFilters(getCategories());
