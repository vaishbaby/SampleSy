import randomColor from 'randomcolor';
import uniqueRandomArray from "./uniqueRandomArray";

class CollateralColorMap {
    randomColors = ["#f98866","#ff420e","#80bd9e","#89da59","390afc5","#336b87",
    "#763626","#68829e","#aebd38","#598234","#486b00","#a2c523","#375e97",
    "#fb6542","#ffbb00","#f18d9e","#4cb5f5","#f4cc70","#8d230f","#1995ad",
    "#ec96a4","#f0810f","#4b7447","#cb0000"];
    collateralCMap = {
        "Corporate Overview": "#7bf19b",
        "Proposals & Presentation": "#f1a87b",
        "Newsletters": "#cafb62",
        "White Papers": "#fb6262",
        "Case Studies": "#7bc5f1",
        "Brand Stories": "#f17bf0",
        "Capabilities":"#9562fb"
    };
    public getColor(obj, key): string {
        if (obj.hasOwnProperty(key)){
            return obj[key];
        } else {
            let unqRnd = uniqueRandomArray(this.randomColors)();
            if(this.randomColors.indexOf(unqRnd) !== -1){
                return unqRnd;
            }
        }
        return randomColor ();
    }
}

export default CollateralColorMap;