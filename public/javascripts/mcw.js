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

[].forEach.call(document.querySelectorAll('.mdc-ripple-surface'), function (surface) {
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
if (document.querySelector('.mdc-drawer--temporary')) {
    let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
    document.querySelector('.navbar-drawer-toggle').addEventListener('click', () => drawer.open = true);
}

/* Forms */
[].forEach.call(document.querySelectorAll('.mdc-form-control'), function (formControl) {
    if (formControl.querySelector('.mdc-text-field')) {
        var helper = formControl.querySelector('.mdc-text-field-helper-text');
        var element = formControl.querySelector('.mdc-text-field');
        var textField = new mdc.textField.MDCTextField(element);
    }
    if (formControl.querySelector('.mdc-select')) {
        mdc.select.MDCSelect.attachTo(formControl.querySelector('.mdc-select'));
    }
});

[].forEach.call(document.querySelectorAll('.mdc-text-field--textarea'), function (textarea) {
    new mdc.textField.MDCTextField(textarea);
});