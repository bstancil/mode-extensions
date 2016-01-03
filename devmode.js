var mode = {
    version: "0.0.1"
  };


function drawGrid(o,dataset) {
  
  if (o["html_element"]) { 
    htmlElement = o["html_element"];
  } else {
    htmlElement = "body";
  }
  
  $(htmlElement).addClass("heatmap-container");
  
  var data = dataset,
  	  columns = [{name: "cohort",type: "string"}, {name: "period",type: "float"}, {name: "retained_users",type: "integer"}, {name: "cohort_size",type: "integer"}],
  // var data = datasets.filter(function(d) { return d.queryName == o["query_name"]; })[0].content,
      // columns = datasets.filter(function(d) { return d.queryName == o["query_name"]; })[0].columns,
      cohorts = _.uniq( _.pluck(data, o["cohort_column"]) ),
      pivots = _.uniq( _.pluck(data, o["pivot_column"]) );
  
  var color = d3.scale.quantize()
    .domain(d3.extent(data, function(d) { return d[o["value_column"]]; }))
    .range(["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"])
  
  d3.select(htmlElement)
    .append("div")
    .attr("class","heatmap-title")
    .text(function() { if (o["title"]) { return o["title"]; } })

  d3.select(htmlElement)
    .append("div")
    .attr("class","heatmap-pivot-label")
    .text(function() { if (o["pivot_label"]) { return o["pivot_label"]; } })
  
  
  if (o["total_column"]) {
    headers = [o["cohort_column"],o["total_column"]].concat(pivots)  
  } else {
    headers = [o["cohort_column"]].concat(pivots)
  }
  
  var table = d3.select(htmlElement).append("table")
      .attr("class","heatmap-table");
  
  table.selectAll(".heatmap-table-header")
    .data([0])
  .enter().append("tr")
    .attr("class","heatmap-table-header")
    .selectAll("heatmap-table-header-cell")
    .data(headers)
  .enter().append("td")
    .attr("class",function(d) { 
      if (isNaN(d)) { return "heatmap-table-header-cell heatmap-string"; }
      else { return "heatmap-table-header-cell heatmap-number"; }
    })
    .text(function(d) { return d; })
  
  table.selectAll(".heatmap-table-row")
    .data(cohorts)
  .enter().append("tr")
    .attr("class","heatmap-table-row")
    .selectAll(".heatmap-table-cell")
    .data(function(d) { return makeRow(data,d,pivots,o); })
  .enter().append("td")
    .style("background",function(d) { if (checkShade(d,o)) { return color(d.value); } })
    .attr("class",function(d) { return cellClass(d); })
    .text(function(d) { return fmt(d,o); })
    
  function checkShade(entry,options) {
    if (entry.value == "") {
      return false;
    } else if (entry.column == options["pivot_column"] || entry.column == options["total_column"]) {
      return false;
    } else if (entry.column == options["value_column"]) {
      return true;
    } else {
      return false;
    }
  }
  
  function cellClass(entry) {
    var type = getDataType(entry.column);
    
    if (type == "float" || type == "integer") {
      return "heatmap-number";
    } else {
      return "heatmap-string";
    }
  }
  
  function getDataType(column) {
    return columns.filter(function(d) { return d.name == column })[0].type;
  }
  
  function makeRow(data,cohort,pivots,options) {
    var row = [ {column: options["cohort_column"], value: cohort } ];
    
    if (options["total_column"]) { 
      var total = _.filter(data, function(d) { return d[options["cohort_column"]] == cohort; })[0],
          totalObject = { column: options["total_column"], value: total[options["total_column"]] };
      row = row.concat(totalObject); 
    }
    
    pivots.forEach(function(p) {

      var matches = _.filter(data, function(d) { 
        return d[options["cohort_column"]] == cohort && d[options["pivot_column"]] == p 
      });
      
      if (matches.length > 0) {
        entry = d3.mean( _.pluck(matches,options["value_column"]) );
      } else {
        entry = "";
      }
      row = row.concat( {column: options["value_column"], value: entry} )
    })
    return row;
  }
  
  function fmt(entry,options) {
    
    var type = getDataType(entry.column),
        valueColumn = options["value_column"],
        totalColumn = options["total_column"];
    
    var c = d3.format(","),
        p = d3.format(".2p"),
        t = d3.time.format("%b %d, %Y");
    
    if (entry.value == "") { 
      return entry.value;
    } else if (type == "datetime" || type == "timestamp") {
      return t(new Date(entry.value))
    } else if (entry.column == totalColumn) {
      return c(entry.value);
    } else if (entry.column == valueColumn && options["value_is_percent"]) {
      return p(entry.value);
    } else if (entry.column == valueColumn && !options["value_is_percent"]) {
      return c(entry.value);
    } else {
      return entry.value;
    } 
  }
  
  
}

mode.retentionPivot = drawGrid