queue()
        .defer(d3.csv, "/data/col1.csv")
        .await(makeGraphCold);
        
    function makeGraphCold(error, dataC) {
        var ndx = crossfilter(dataC);
        
        // date parsing
        
        var parseDateC = d3.time.format("%d/%m/%Y %H:%M").parse;
        dataC.forEach(function(d){
            d.date = parseDateC(d.date);
            d.temp1 = +d.temp1;
            d.temp2 = +d.temp2;
            d.temp3 = +d.temp3;
            d.temp4 = +d.temp4;
            
        });
        
        // charts 
        
        
        show_composite_trend_c(ndx);
        
        show_scatter_plot_2_c(ndx);
        
        // data_list_c(ndx);
        
        min_Temp_c(ndx);
        
        dc.renderAll();
        
        
        
    }
    
    //Composite line graph
    function show_composite_trend_c(ndx){
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        
        
        var temp1Data = date_dim.group().reduceSum(dc.pluck("temp1"));
        var temp2Data = date_dim.group().reduceSum(dc.pluck("temp2"));
        var temp3Data = date_dim.group().reduceSum(dc.pluck("temp3"));
        var temp4Data = date_dim.group().reduceSum(dc.pluck("temp4"));
        
        var compositeChart_c = dc.compositeChart('.line_Cr');
        
        compositeChart_c
            .width(600)
            .height(280)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .y(d3.scale.linear().domain([0,10]))
            .yAxisLabel("Temperature")
            .xAxisLabel("Date")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .elasticX(false)
            .yAxisPadding(5)
            .compose([
                dc.lineChart(compositeChart_c)
                    .colors('green')
                    .group(temp1Data, "temp1"),
                dc.lineChart(compositeChart_c)
                    .colors('red')
                    .group(temp2Data, "temp2"),
                dc.lineChart(compositeChart_c)
                    .colors('blue')
                    .group(temp3Data, "temp3"),
                dc.lineChart(compositeChart_c)
                    .colors('orange')
                    .group(temp4Data, "temp4"),
            ])
            .brushOn(true)
            .render()
            
        }
        //Scatter Plot composite
        
        function show_scatter_plot_2_c(ndx){
        var date_dim = ndx.dimension(dc.pluck('date'));
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
      
    
        
        
        var temp_dim_1 = ndx.dimension(function (d) {
        return [d.date, d.temp1];
        })
        var temp_dim_2 = ndx.dimension(function (d) {
        return [d.date, d.temp2];
        })
        var temp_dim_3 = ndx.dimension(function (d) {
        return [d.date, d.temp3];
        })
        var temp_group_1 = temp_dim_1.group();
        var temp_group_2 = temp_dim_2.group();
        var temp_group_3 = temp_dim_3.group();
        
        var scatter = dc.compositeChart('.plot_Cr');
        
        scatter
            .width(600)
            .height(280)
            .dimension(date_dim)
            .x(d3.time.scale().domain([minDate, maxDate]))
            .y(d3.scale.linear().domain([0,10]))
            .yAxisLabel("Temperature")
            .xAxisLabel("Date")
            .legend(dc.legend().x(80).y(2).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .elasticX(false)
            .compose([
                dc.scatterPlot(scatter)
                    .colors('green')
                    .group(temp_group_1, "temp1")
                    .symbolSize(2)
                    .clipPadding(10),
                dc.scatterPlot(scatter)
                    .colors('red')
                    .group(temp_group_2, "temp2")
                    .symbolSize(2)
                    .clipPadding(10),
                dc.scatterPlot(scatter)
                    .colors('blue')
                    .group(temp_group_3, "temp3")
                    .symbolSize(2)
                    .clipPadding(10)
            ])
            .brushOn(false)
            
         }
         
         //Table code 1
        
        function data_list_c(ndx){
            d3.csv("data/col1.csv", function(error, data) {
		  if (error) throw error;
		  
		  console.log(data)
		  
		  var sortAscending = true;
		  var table = d3.select('TBD').append('table');
		  var titles = d3.keys(data[0]);
		  var headers = table.append('thead').append('tr')
		                   .selectAll('th')
		                   .data(titles).enter()
		                   .append('th')
		                   .text(function (d) {
			                    return d;
		                    });
		  
		  var rows = table.append('tbody').selectAll('tr')
		               .data(data).enter()
		               .append('tr');
		  rows.selectAll('td')
		    .data(function (d) {
		    	return titles.map(function (k) {
		    		return { 'value': d[k], 'name': k};
		    	});
		    }).enter()
		    .append('td')
		    .attr('data-th', function (d) {
		    	return d.name;
		    })
		    .text(function (d) {
		    	return d.value;
		    });
	  });
        }
// Table code 

        function min_Temp_c(ndx){
            d3.csv("data/col1.csv", function(error, data) {
		  if (error) throw error;
		  //console.log(data)
		  
		  var minTemp1 = d3.min(data, function(d) {return d.temp1});
		  var maxTemp1 = d3.max(data, function(d) {return d.temp1});
		  var highlowTemp1 = d3.extent(data, function(d) {return d.temp1});
		  var meanTemp1 = d3.mean(data, function(d) {return d.temp1});
		  var staDevTemp1 = d3.deviation(data, function(d) {return d.temp1});
		 
		  //console.log(minTemp1 + " Minimum Tempertaures")
		  //console.log(maxTemp1 + " Maximum Tempertaures")
		  //console.log(highlowTemp1 + " High and low")
		  //console.log(meanTemp1 + " Mean Temperatures")
		  //console.log(staDevTemp1 + " Standard deviation at Temperature 1")
		  
		  var tabulate = function (data,columns) {
          var table = d3.select('.temp_Cr').append('table')
        	var thead = table.append('thead')
        	var tbody = table.append('tbody')
        
        	thead.append('tr')
        	  .selectAll('th')
        	    .data(columns)
        	    .enter()
        	  .append('th')
        	    .text(function (d) { return d })
        
        	var rows = tbody.selectAll('tr')
        	    .data(data)
        	    .enter()
        	  .append('tr')
        
        	var cells = rows.selectAll('td')
        	    .data(function(row) {
        	    	return columns.map(function (column) {
        	    		return { column: column, value: row[column] }
        	      })
              })
              .enter()
            .append('td')
              .text(function (d) { return d.value })
        
          return table;
        }
        
        d3.csv('data/col1.csv',function (data) {
        	var columns = ['date','temp1','temp2','temp3','temp4']
          tabulate(data,columns)
        })
		  
        });
        }
        
        
