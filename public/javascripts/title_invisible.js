$(function() {
    for (let i = 1; i < 7; i++) {
        $("h" + i).each((id, elem) => {

            elem.innerHTML = elem.innerHTML.replace(/ /g, '<span class="invisible-character">·</span><wbr>')
                + '<span class="invisible-character">¬</span>';
            console.log(elem);
        });
    }
});