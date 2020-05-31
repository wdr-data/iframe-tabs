export default function () {
    window.addEventListener("message", function (a) {
        console.log(a.data);
        if (typeof data === 'string') return;
        const cmd = a.data["data-tabs-command"];
        const tgt = a.data["data-tabs-target"];
        if (!cmd) return;
        if (tgt !== "%%uuid%%") return;
        const n = document.getElementById("data-tabs-" + tgt);
        if (!n) return;
        if (cmd["set-height"]) {
            n.style.height = cmd["set-height"].value + "px";
        }
    })
}
