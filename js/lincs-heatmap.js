
function drawCircos(error, datasetFile) {
  var width = 800;//document.getElementsByClassName('mdl-card__supporting-text')[0].offsetWidth
  var circosHeatmap = new Circos({
        container: '#heatmapChart',
        width: width,
        height: width
    });
  selected_term = $('#selected-term').html();
  technology_colors = {'Fluorescence imaging': '#8dd3c7', 'L1000': '#ffffb3', 'Cellarium': '#bebada', 'P100 (mass spectrometry)': '#fb8072', 'KiNativ': '#80b1d3', 'RPPA': '#fdb462', 'Mass spectrometry': '#b3de69'}
  filteredDatasets = datasetFile.filter(function(dataset) {
    return dataset.term == selected_term;
  });
  datasets = filteredDatasets.map(function(d) {
      return {
        id: d.datasetid,
        label: d.datasetid,
        len: 10,
        color: technology_colors[d.technologies]
      }
  })
  datasetText = filteredDatasets.map(function(d) {
    return {
      block_id: d.datasetid,
      position: 7,
      value: d.datasetid,
      datasetgroup: d.datasetgroup,
      ldplink: d.ldplink,
      technologies: d.technologies,
    }
  })
  datasetTechnology = filteredDatasets.map(function(d) {
    return {
      block_id: d.datasetid,
      position: 5,
      value: "technology",
      technology: d.technologies
    }
  })
  associatedTerms = filteredDatasets.map(function(d) {
    return {
      block_id: d.datasetid,
      start: 0,
      end: 10,
      value: parseInt(d.associated_terms),
      label: d.associated_term_names
    }
  })
  console.log(filteredDatasets);
  circosHeatmap
    .layout(
      datasets,
      {
        innerRadius: width / 2 - 240,
        outerRadius: width / 2 - 150,
        ticks: {display: false},
        labels: {
          position: 'center',
          display: false,
          size: 14,
          color: 'white',
          radialOffset: 10
        },
        clickCallback: function() {console.log('hello')}
      }
    )
    .text('datasetText', datasetText, {
      innerRadius: 0.71,
      outerRadius: 1.01,
      style: {
        'font-size': 12,
        fill: 'black',
        opacity: 1
      },
      tooltipContent: function(d) {
        return 'Dataset ID: '+d.value+'<br>Dataset Group: '+d.datasetgroup+'<br>Technology: '+d.technologies;
      }
    })
    .histogram('associatedTerms', associatedTerms, {
      innerRadius: 1.01,
      outerRadius: 1.35,
      color: 'Blues',
      min: 0.5,
      logScale: true,
      tooltipContent: function (d) {
        var label = $('#selected-term').attr('data-term-type') == 'cell_line' ? 'cell lines' : 'small molecules';
        return d.value.toLocaleString()+' associated '+ label +'<br>';// +' '+d.label;
      }
    })
    .render()
}

// function drawHeatmap(gene) {
//   d3.queue()
//     .defer(d3.json, './data/drugs.json')
//     .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_cytosolic.txt')
//     .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_cytosolic.txt')
//     .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_nuclear.txt')
//     .await(drawCircos)
// };
