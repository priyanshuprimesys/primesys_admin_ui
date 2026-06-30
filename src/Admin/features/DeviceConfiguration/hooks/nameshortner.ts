
function nameShortner(name: string | undefined | null) {



    if (!name) {
        return '';
    }

    while (name.includes("_autoresend")) {
        name = name.replace("_autoresend", "");
    }
    
    return name;

}



export { nameShortner };