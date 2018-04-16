mdc.autoInit();

[].forEach.call(document.querySelectorAll('.mdc-button'), function (surface) {
    mdc.ripple.MDCRipple.attachTo(surface);
});

[].forEach.call(document.querySelectorAll('.mdc-card__primary-action'), function (surface) {
    mdc.ripple.MDCRipple.attachTo(surface);
});

[].forEach.call(document.querySelectorAll('.mdc-list-item'), function (surface) {
    mdc.ripple.MDCRipple.attachTo(surface);
});

[].forEach.call(document.querySelectorAll('.mdc-menu'), function (menuDom) {
    var menu = new mdc.menu.MDCMenu(menuDom);
    document.querySelector(menuDom.dataset.anchor).addEventListener('click', function () {
        menu.open = !menu.open;
    });
    if (menuDom.dataset.anchorPosition) {
        menu.setAnchorCorner(mdc.menu.MDCMenuFoundation.Corner[menuDom.dataset.anchorPosition]);
    }
});


/* Navbar only */
let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
document.querySelector('.navbar-drawer-toggle').addEventListener('click', () => drawer.open = true);