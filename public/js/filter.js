const FILTER_SELECTOR = "js-filter";
const FILTERED_SELECTOR = "filtered-out";
const CATEGORY_PARENT_SELECTOR = "js-cat-container";
const FILTER_SELECTED_SELECTOR = "filter-selected";
const FILTERING_ACTIVE_SELECTOR = "filters-active";
const FILTER_RESET_SELECTOR = "js-filter-reset";
const DISPLAY_NONE_SELECTOR = "d-none";
const projectGrid = document.querySelector(".o-grid__projects");
const projectTiles = document.querySelectorAll(".project-tile");
let activeFilters = [];
let windowUrl = new URL(window.location.href);
let tilesFilteredCount = 0;

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

// onload check/manage filters
const checkSearchParams = (url, useHistory = false) => {
  let searchParams = url.searchParams;

  if (searchParams.has("filter")) {
    // apply available searchParams to activeFilters
    activeFilters = searchParams.getAll("filter");
    for (let i = 0; i < activeFilters.length; i++) {
      if (
        document.querySelector(`.js-filter [data-filter='${activeFilters[i]}']`)
      ) {
        const projectFilter = document.querySelector(
          `.js-filter [data-filter='${activeFilters[i]}']`
        );
        if (
          projectFilter.dataset.filter.toLowerCase() == activeFilters[i] &&
          !projectFilter.classList.value.includes(FILTER_SELECTED_SELECTOR)
        ) {
          projectFilter.click();
        }
      }
    }
  }
};

const handleSearchParams = (type, cssClass) => {
  let queryParams = new URLSearchParams(window.location.search);

  if (type == "add" && !queryParams.toString().includes(cssClass)) {
    queryParams.append("filter", cssClass);
  } else if (type == "remove" && queryParams.toString().includes(cssClass)) {
    queryParams = new URLSearchParams(
      queryParams.toString().replace(`filter=${cssClass}`, "")
    );
  } else if (type == "reset") {
    queryParams.delete("filter");
  }

  history.pushState(
    { filter: queryParams.toString() },
    "",
    "?" + queryParams.toString()
  );
};

const handleHistory = () => {
  windowUrl = new URL(window.location.href);
  // update active filters based on current url
  activeFilters = windowUrl.searchParams.getAll("filter");

  if (activeFilters.length == 0) {
    handleResetFilter(FILTER_RESET_SELECTOR, activeFilters);
    handleFilters(activeFilters, true);
    checkTiles(FILTERED_SELECTOR, true);
    handleSearchParams("reset", "reset");
    history.pushState(null, null, window.location.href.replace("?", ""));
    return;
  }

  const filters = document.querySelectorAll(`.js-filter [data-filter]`);
  for (let i = 0; i < filters.length; i++) {
    if (
      !activeFilters.includes(filters[i].dataset.filter.toLowerCase()) &&
      filters[i].classList.value.includes(FILTER_SELECTED_SELECTOR)
    ) {
      filters[i].classList.remove(FILTER_SELECTED_SELECTOR);
    } else if (
      activeFilters.includes(filters[i].dataset.filter.toLowerCase()) &&
      !filters[i].classList.value.includes(FILTER_SELECTED_SELECTOR)
    ) {
      filters[i].classList.add(FILTER_SELECTED_SELECTOR);
    }

    checkTiles(FILTERED_SELECTOR);
  }
};

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

  return catArray.sort();
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

const handleResetFilter = (resetId, arr) => {
  const filterReset = document.querySelector(`#${resetId}`);
  if (arr.length > 0) {
    filterReset.classList.remove(DISPLAY_NONE_SELECTOR);
  } else {
    filterReset.classList.add(DISPLAY_NONE_SELECTOR);
  }
};

const handleFilters = (arr, reset = false) => {
  const filterParent = document.querySelector(`.${FILTER_SELECTOR}`);
  // TODO: figure out a behavior for labeling the tags
  // filterParent.innerHTML =
  //   '<p class="text-center text-light">View projects by</p>';

  if (reset == false) {
    filterParent.innerHTML += arr
      .map((item) => {
        return `<button class="btn btn-outline-secondary m-1" data-filter="${item.toLowerCase()}">${item}</button>`;
      })
      .join("");

    filterParent.innerHTML +=
      '<button id="js-filter-reset" class="btn btn-reset-filters btn-outline-secondary m-1 d-none" data-filter="reset">Reset filters</button>';

    for (filter of filterParent.children) {
      filter.addEventListener("click", (e) => {
        handleFilter(e);
        if (filter.id == FILTER_RESET_SELECTOR) {
          handleResetFilter(filter.id, activeFilters);
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
  const filter = e.target;
  const targetClass = filter.dataset.filter.toLowerCase();

  // if reset
  if (filter.id == FILTER_RESET_SELECTOR) {
    handleFilters(activeFilters, true);
    checkTiles(FILTERED_SELECTOR, true);
    handleSearchParams("reset", "reset");
    history.pushState(null, null, window.location.href.replace("?", ""));
    return;
  }

  filter.classList.toggle(FILTER_SELECTED_SELECTOR);

  if (filter.classList.value.toLowerCase().includes(FILTER_SELECTED_SELECTOR)) {
    // add filter to activeFilters
    activeFilters.push(targetClass);
    checkTiles(FILTERED_SELECTOR);
    handleSearchParams("add", targetClass);
  } else {
    // remove filter from activeFilters
    activeFilters.splice(activeFilters.indexOf(targetClass), 1);
    checkTiles(FILTERED_SELECTOR);
    handleSearchParams("remove", targetClass);
  }

  if (activeFilters.length == 0) {
    projectTiles.forEach((tile) => {
      tile.classList.remove(FILTERED_SELECTOR);
    });
  }
};

addProjectCategories();
handleFilters(getCategories());
checkSearchParams(windowUrl);
window.addEventListener("popstate", handleHistory);
