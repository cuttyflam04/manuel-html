document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("pre code.language-html").forEach(code => {

        const pre = code.parentElement;

        const btn = document.createElement("button");

        btn.innerHTML = "👁";

        btn.className = "preview-button";

        btn.title = "Prévisualiser";

        btn.onclick = () => {

            const w = window.open("", "_blank");

            w.document.open();

            w.document.write(code.textContent);

            w.document.close();

        };

        pre.parentElement.insertBefore(btn, pre);

    });

});