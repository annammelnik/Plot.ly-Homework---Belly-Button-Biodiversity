
function buildthechart(patientID) {

    d3.json("samples.json").then((data => {

        var samples = data.samples
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        var filtersample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        var sample_values = filtersample.sample_values

        var otu_ids = filtersample.otu_ids

        var otu_labels = filtersample.otu_labels


        var bar_data = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'blue'
            },
        }]


        var bar_layout = {
            title: "Top 10 Species in Belly Buttons",
            yaxis: { title: "OTUs" }
        };

        Plotly.newPlot('bar', bar_data, bar_layout)

        var bubble_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: 'black',
                size: sample_values,
                colorscale: 'grey'
            }
        }];


        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTUs" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot('bubble', bubble_data, layout)

        var washFreq = filteredMetadata.wfreq

        var gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: "Washes Per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 3], color: 'orange' },
                        { range: [3, 6], color: 'yellow' },
                        { range: [6, 9], color: 'green' },
                    ],

                }
            }
        ];

        // Define Plot layout
        var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

        // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    }))


};


// FUNCTION #2 of 4
function populateDemoInfo(patientID) {

    var demographicInfoBox = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log(filteredMetadata)
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
        })


    })
}

// FUNCTION #3 of 4
function optionChanged(patientID) {
    console.log(patientID);
    buildthechart(patientID);
    populateDemoInfo(patientID);
}

// FUNCTION #4 of 4
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
        buildthechart(patientIDs[0]);
        populateDemoInfo(patientIDs[0]);
    });
};

initDashboard();





