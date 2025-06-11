

class Blockrender {
    render(data) {
        switch (data.type) {
            case("info"): 
                console.log("info");
                break;
            case("alert"):
                console.log("alert");
                break;
            case("radio"):
                console.log("radio");
                break;
            case("checkbox"):
        }
    }
}