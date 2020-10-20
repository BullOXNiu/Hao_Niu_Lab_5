const margin = ({top: 20, right: 20, bottom: 40, left: 60});
const width = 650 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
var newData;

var svg = d3.select('.chart')
            .append('svg')
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var ordinalScale = d3.scaleBand()
                     .rangeRound([0, width])
                     .paddingInner(0.1)

const xAxis = d3.axisBottom()
                .scale(ordinalScale);

svg.append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`);

var linearScale = d3.scaleLinear()
                    .range([height, 0])
            
const yAxis = d3.axisLeft()
                .scale(linearScale);

svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);    

var yLabel = svg.append("text")
                .attr('x', 5)
                .attr('y', -10)
                .attr('alignment-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .attr('font-size', 16);


let order = 1;

var dataKey = function(d) {
    return d.company;
};

function update(data, type){
        data = data.sort((a,b) => (a[type] - b[type]) * order)

        
        ordinalScale.domain(data.map(d => dataKey(d)));
        linearScale.domain([0, d3.max(data, d => d[type])]);

        var bars = svg.selectAll('rect')
                      .data(data, dataKey);

        bars.enter()
            .append('rect')
            .merge(bars)
            .transition()
            .duration(1400)
            .attr('width', d => ordinalScale.bandwidth())
            .attr('height', d => (height - linearScale(d[type])))
            .attr('x', d => ordinalScale(dataKey(d)))
            .attr('y', d => linearScale(d[type]))
            .attr('fill','#FC9D00');

        bars.exit()
            .transition()
            .duration(100)
            .remove();
        
        svg.select(".x-axis")
           .transition()
           .duration(1000)
           .call(xAxis);

        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
        
        yLabel.text(type.toUpperCase());
    }


let type = d3.select('#group-by').node().value;

d3.csv('coffee-house-chains.csv', d3.autoType).then(data=>{
        newData = data
        update(data, type);
});

d3.select('#group-by')
  .on('change', (event,d) => {
   type = event.target.value;
   update(newData, type);
})

d3.select('#sort')
  .on('click', (event,d)=>{
      order = order * -1
      update(newData, type);
})