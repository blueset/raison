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
