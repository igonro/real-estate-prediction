$.ajaxSetup({ async: false });
let distNeigh;
$.getJSON("/dist-neigh", function (data) {
    distNeigh = data;
});
$.ajaxSetup({ async: true });

(() => {
    $(".selectize-parent").removeAttr("style");

    $("#district").removeClass("form-select");
    $("#neighborhood").removeClass("form-select");

    $("#district").selectize({
        sortField: "text",
    });
    $("#neighborhood").selectize({
        sortField: "text",
    });
})();

const neighOptions = [];
for (const [k, v] of Object.entries(document.getElementById("neighborhood").selectize.options)) {
    neighOptions.push(jQuery.extend(true, {}, v));
}

const mapHtml = document.getElementById("map");
let map = L.map(mapHtml).setView([40.417, -3.6589], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const blackIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
const goldIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const onClick = (e) => {
    const distSelect = document.getElementById("district");
    distSelect.selectize.clear(true);
    distSelect.selectize.addItem(`d${Object.keys(distNeigh).indexOf(e.target.options.title)}`, false);
};

const markers = {
    d0: L.marker([40.3968, -3.6972], { title: "Arganzuela", icon: blackIcon }).on("click", onClick).addTo(map),
    d1: L.marker([40.4724, -3.579], { title: "Barajas", icon: blackIcon }).on("click", onClick).addTo(map),
    d2: L.marker([40.3736, -3.7444], { title: "Carabanchel", icon: blackIcon }).on("click", onClick).addTo(map),
    d3: L.marker([40.4167, -3.70358], { title: "Centro", icon: blackIcon }).on("click", onClick).addTo(map),
    d4: L.marker([40.4584, -3.6762], { title: "Chamartín", icon: blackIcon }).on("click", onClick).addTo(map),
    d5: L.marker([40.4387, -3.7053], { title: "Chamberí", icon: blackIcon }).on("click", onClick).addTo(map),
    d6: L.marker([40.448, -3.6505], { title: "Ciudad Lineal", icon: blackIcon }).on("click", onClick).addTo(map),
    d7: L.marker([40.42627, -3.70091], { title: "Fuencarral", icon: blackIcon }).on("click", onClick).addTo(map),
    d8: L.marker([40.4718, -3.6423], { title: "Hortaleza", icon: blackIcon }).on("click", onClick).addTo(map),
    d9: L.marker([40.4031, -3.7363], { title: "Latina", icon: blackIcon }).on("click", onClick).addTo(map),
    d10: L.marker([40.435, -3.7192], { title: "Moncloa", icon: blackIcon }).on("click", onClick).addTo(map),
    d11: L.marker([40.4053, -3.6449], { title: "Moratalaz", icon: blackIcon }).on("click", onClick).addTo(map),
    d12: L.marker([40.3869, -3.6592], { title: "Puente de Vallecas", icon: blackIcon }).on("click", onClick).addTo(map),
    d13: L.marker([40.4109, -3.6761], { title: "Retiro", icon: blackIcon }).on("click", onClick).addTo(map),
    d14: L.marker([40.427, -3.6806], { title: "Salamanca", icon: blackIcon }).on("click", onClick).addTo(map),
    d15: L.marker([40.4602, -3.6984], { title: "Tetuán", icon: blackIcon }).on("click", onClick).addTo(map),
    d16: L.marker([40.3833, -3.7061], { title: "Usera", icon: blackIcon }).on("click", onClick).addTo(map),
    d17: L.marker([40.3956, -3.5771], { title: "Vicálvaro", icon: blackIcon }).on("click", onClick).addTo(map),
    d18: L.marker([40.3728, -3.6118], { title: "Villa de Vallecas", icon: blackIcon }).on("click", onClick).addTo(map),
    d19: L.marker([40.3499, -3.7002], { title: "Villaverde", icon: blackIcon }).on("click", onClick).addTo(map),
};

const filterNeighborhoods = () => {
    const neighSelect = document.getElementById("neighborhood");
    const distSelect = document.getElementById("district");
    for (const [k, marker] of Object.entries(markers)) marker.setIcon(blackIcon);
    if (distSelect[0].value !== "") {
        markers[distSelect[0].value].setIcon(goldIcon);
        map.setView(markers[distSelect[0].value].getLatLng(), 13);
    }
    let neighOption = "";
    if (neighSelect[0].innerText !== "") neighOption = neighSelect[0].innerText;
    neighSelect.selectize.clear(true);
    neighSelect.selectize.clearOptions(true);
    let neighList = distNeigh[distSelect[0].innerText];
    if (neighList === undefined) neighSelect.selectize.addOption(neighOptions);
    else {
        const filteredOptions = [];
        for (const neigh of neighList) for (const opt of neighOptions) if (opt.text === neigh) filteredOptions.push(opt);
        neighSelect.selectize.addOption(filteredOptions);
        if (neighList.includes(neighOption)) {
            const dIndex = Object.keys(distNeigh).indexOf(distSelect[0].innerText);
            const nIndex = neighList.indexOf(neighOption);
            neighSelect.selectize.addItem(`d${dIndex}n${nIndex}`, true);
        }
    }
};
const setDistrict = () => {
    const neighSelect = document.getElementById("neighborhood");
    const distSelect = document.getElementById("district");
    if (neighSelect[0].innerText !== "")
        for (const [key, value] of Object.entries(distNeigh))
            if (value.includes(neighSelect[0].innerText)) {
                distSelect.selectize.clear(true);
                distSelect.selectize.addItem(`d${Object.keys(distNeigh).indexOf(key)}`, false);
            }
};

const predict = (event) => {
    let formData = {
        area: event.target.elements["sq-meters"].value,
        rooms: event.target.elements["n-rooms"].value,
        bathrooms: event.target.elements["n-bathrooms"].value,
        type: event.target.elements["house-type"].value,
        floor: event.target.elements["floor"].value,
        energy: event.target.elements["energy-cert"].value,
        neighborhood: event.target.elements["neighborhood"].innerText,
        exterior: event.target.elements["is-exterior"].checked,
        lift: event.target.elements["has-lift"].checked,
        parking: event.target.elements["has-parking"].checked,
    };
    $.post(
        "/predict",
        formData,
        function (data) {
            $("#predicted-buy").val(data["buy"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#predicted-rent").val(data["rent"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        },
        "json"
    );
    return false;
};
