import kmc_static from '../config/kmc_static';
import result_infos from '../config/result_info';

const all_m = Object.keys(kmc_static).map((x) => {
    return parseInt(x);
})

const create_plot_data = (predictions, kmcdata) => {
    let data = [];
    
    Object.keys(predictions).forEach((key) => {
        console.log("kk", key)
        let element = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'red' },
            name: "",
            visible: 'legendonly'
        };

        let group = findNearest(Math.round(predictions[key]));
        element.x = kmc_static[String(group)].x;
        element.y = kmc_static[String(group)].KM_estimate;
        element.name = result_infos.filter((e) => e.Treatment === key)[0].Show_name
        element.marker.color = result_infos.filter((e) => e.Treatment === key)[0].Trace_color


        // plot CI
        let ci_element = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'red' },
            name: "",
            visible: 'true',
            showlegend: false, 
            fill: "tozerox", 
            fillcolor: element.marker.color + "10", 
            line: {color: "transparent"}, 
        };

        ci_element.x = element.x.concat(element.x.slice().reverse());
        ci_element.y = kmc_static[String(group)].Upper_CI.concat(kmc_static[String(group)].Lower_CI.slice().reverse());
        ci_element.name = result_infos.filter((e) => e.Treatment === key)[0].Show_name

        
        if (kmcdata.length !== 0){
            let legend_status = kmcdata.filter(e => e.name === key)[0].plotdata;
            element.visible = legend_status.visible
            ci_element.visible = legend_status.visible;
        }
        else if (key === "Best_support_care"){
            element.visible = true;
            ci_element.visible = true;
        }

        data.push({name: key, plotdata: element});
        data.push({name: key+'_ci', plotdata: ci_element})
    })
    return data;
}

function findNearest(target) {
    // Handle cases where the target is less than the first or greater than the last element
    if (target < all_m[0]) return 0;
    if (target > all_m[all_m.length - 1]) return all_m.length - 1;

    let left = 0;
    let right = all_m.length - 1;

    // Binary search to find the midpoint
    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (all_m[mid] === target) {
            return mid;
        } else if (all_m[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // If the loop exits because left === right, check which neighbor is closer
    return Math.abs(all_m[left] - target) < Math.abs(all_m[right] - target) ? left : right;
}

export default create_plot_data;
