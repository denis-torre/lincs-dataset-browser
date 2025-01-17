
function drawCircos(error, drugs, annotations, cytosolicFC, nuclearFC) {
  var width = 800;//document.getElementsByClassName('mdl-card__supporting-text')[0].offsetWidth
  var circosHeatmap = new Circos({
        container: '#heatmapChart',
        width: width,
        height: width
    });
  gene = $('#selected-gene').html();
  console.log(gene);
  FCs = []
  $.each(cytosolicFC.concat(nuclearFC), function(i, elem) {
  	FCs.push(Math.abs(elem.logfc));
  });
  maxFC = Math.max.apply(null, FCs);

    cytosolicFC = cytosolicFC.map(function(d) {
      return {
        block_id: d.drug_name,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: -parseFloat(d.logfc),
        concentration: parseFloat(d.concentration),
        timepoint: parseInt(d.timepoint),
        bonferroni_pvalue: parseFloat(d.bonferroni_pvalue)
      };
    })
    nuclearFC = nuclearFC.map(function(d) {
      return {
        block_id: d.drug_name,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: -parseFloat(d.logfc),
        concentration: parseFloat(d.concentration),
        timepoint: parseInt(d.timepoint),
        bonferroni_pvalue: parseFloat(d.bonferroni_pvalue)
      };
    })
    drugConcentration = annotations.map(function(d) {
      return {
        block_id: d.drug_name,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: parseFloat(d.concentration),
        timepoint: parseInt(d.timepoint),
      };
    })
    timepoint = annotations.map(function(d) {
      return {
        block_id: d.drug_name,
        start: parseInt(d.start),
        end: parseInt(d.end),
        value: parseInt(d.timepoint),
      };
    })
    circosHeatmap
      .layout(
        drugs,
        {
          innerRadius: width / 2 - 200,
          outerRadius: width / 2 - 170,
          ticks: {display: false},
          labels: {
            position: 'center',
            display: true,
            size: 14,
            color: '#000',
            radialOffset: 10
          }
        }
      )
      .heatmap('nuclearFC', nuclearFC, {
        innerRadius: 0.75,
        outerRadius: 0.99,
        logScale: false,
        color: 'RdBu',
        min: -maxFC,
        max: maxFC,
        tooltipContent: function (d) {
          return d.block_id+' | nuclear | '+d.concentration+'µm, '+d.timepoint+'h<br>logFC: '+-d.value.toFixed(2)+'<br>(vs DMSO '+d.timepoint+'h)<br><img src="/images/differential_expression/'+gene+'-'+d.block_id+'-'+d.concentration+'-nuclear-'+d.timepoint+'h.png" style="margin: 5px 10px;">'//+'<br>Bonferroni P: '+d.bonferroni_pvalue.toExponential()
        }

      })
      .heatmap('cytosolicFC', cytosolicFC, {
        innerRadius: 1.01,
        outerRadius: 1.20,
        logScale: false,
        color: 'RdBu',
        min: -maxFC,
        max: maxFC,
        tooltipContent: function (d) {
          return d.block_id+' | cytosolic | '+d.concentration+'µm, '+d.timepoint+'h<br>logFC: '+-d.value.toFixed(2)+'<br>(vs DMSO '+d.timepoint+'h)<br><img src="/images/differential_expression/'+gene+'-'+d.block_id+'-'+d.concentration+'-cytosolic-'+d.timepoint+'h.png" style="margin: 5px 10px;">'//+'<br>Bonferroni P: '+d.bonferroni_pvalue.toExponential()
        }
      })
      .heatmap('drugConcentration', drugConcentration, {
        innerRadius: 1.21,
        outerRadius: 1.30,
        logScale: true,
        color: 'Blues',
        tooltipContent: function (d) {
          return d.block_id+' | '+d.value+'µM'
        }
      })
      .histogram('timepoint', timepoint, {
        innerRadius: 1.31,
        outerRadius: 1.40,
        color: 'OrRd',
        min: 0,
        max: 72,
        tooltipContent: function (d) {
          return d.block_id+' | '+d.value+'h timepoint'
        }
      })
      .render()
}

function drawHeatmap(gene) {
  d3.queue()
    .defer(d3.json, './data/drugs.json')
    .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_cytosolic.txt')
    .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_cytosolic.txt')
    .defer(d3.csv, './data/differential_expression/'+gene+'-differential_expression_nuclear.txt')
    .await(drawCircos)
};
