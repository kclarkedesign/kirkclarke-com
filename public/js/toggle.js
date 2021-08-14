const TOGGLE_BTN_SELECTOR = ".js-toggle";
const NAV_LINK_SELECTOR = ".nav-link";
const TOGGLE_NAV_CLASS = "is-open";

function toggleClass($elem, className) {
  $elemTarget = document.querySelector(`.${$elem.dataset.toggle}`);
  if ($elemTarget.classList.value.includes(className)) {
    $elemTarget.classList.remove(className);
  } else {
    $elemTarget.classList.add(className);
  }
}

function toggleNavClass($elem) {
  if ($elem.classList.value.includes(TOGGLE_NAV_CLASS)) {
    $elem.classList.remove(TOGGLE_NAV_CLASS);
  } else {
    $elem.classList.add(TOGGLE_NAV_CLASS);
  }
}

function handleMainNavLinks(nodes, event, callback) {
  nodes.forEach((node, index) => {
    node.addEventListener(event, function () {
      node.parentElement.previousSibling.previousSibling.classList.remove(
        TOGGLE_NAV_CLASS
      );
      node.parentElement.classList.remove(TOGGLE_NAV_CLASS);
    });
  });
}

const $elems = document.querySelectorAll(TOGGLE_BTN_SELECTOR);

$elems.forEach((element) => {
  element.addEventListener("click", function () {
    toggleNavClass(element);
    toggleClass(element, TOGGLE_NAV_CLASS);
  });
});

const $navLinkElems = document.querySelectorAll(NAV_LINK_SELECTOR);

handleMainNavLinks($navLinkElems, "click");
