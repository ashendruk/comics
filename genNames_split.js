(function() {

var margin = {top: 100, right: 50, bottom: 50, left: 40},
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([10, height], 1);

var x = d3.scaleLinear()
    .range([width, 0]);

// Functions for offsetting annotations    
function dy(t) {
  return y(t)-y(0);
}
function dx(t) {
  return x(t)-x(0);
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#genNames_graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });

  function ascendingFemaleNames(data) {data.sort(function(x, y){
  if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
  else return -1
});}

ascendingFemaleNames(data);


  x.domain([30,-30]);
  y.domain(data.map(function(d) { return d.gen_cat; }));



 //Circle annotation examples
  const circleAnnotations_girl = [
    // Two annotations in this example array
    {
      note: {
        title: "Girls, not women",
        label: "'Girl' is the third-most common gendered name for a female character. 'Boy' only shows up sixth for males."
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(-13),         //Give x() the percent difference you want
      y: y('girl'),    //Give y() the name of the power ie 'Divine', 'Elemental and environmental powers', 'Energy manipulation', 'Enhanced physical abilities', 'Enhanced skills', 'Mentality-based powers', 'Objects', 'Physics or reality manipulation', 'Shapeshifting', 'Supernatural physical abilities', 'Energy manipulation', 'Shapeshifting'
      // dx is how FAR the annotation text is from the point x (leave dy=0 for this graph)
      dx: dx(-7),
      dy: 0,
      subject: {
        radius: 2,         //Size of the the circling
        radiusPadding: 40    //A little gap between the annotation line and the circle
      }
    }
  ]
  const makeCircleAnnotations_girl = d3.annotation()
    .editMode(false)
    .type(d3.annotationCalloutCircle)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(circleAnnotations_girl)
  svg.append("g")
      .attr("id", "girl_anno")
      .attr("class", "annotation-group")
      .call(makeCircleAnnotations_girl)      //This needs to call the object made above





//Circle annotation examples
  const circleAnnotations_man = [
    // Two annotations in this example array
    {
      note: {
        title: "Men, not boys",
        label: "A full 30% of male characters with gendered names get 'man' in their name. That number is only 6% for 'woman'."
      },
      // x,y are the point that the annotation points too
      // (by using the functions x() and y() this is done in graph units rather than pixels)
      x: x(30),         //Give x() the percent difference you want
      y: y('woman'),    //Give y() the name of the power ie 'Divine', 'Elemental and environmental powers', 'Energy manipulation', 'Enhanced physical abilities', 'Enhanced skills', 'Mentality-based powers', 'Objects', 'Physics or reality manipulation', 'Shapeshifting', 'Supernatural physical abilities', 'Energy manipulation', 'Shapeshifting'
      // dx is how FAR the annotation text is from the point x (leave dy=0 for this graph)
      dx: dx(-2),
      dy: 50
    }
  ]
  const makeCircleAnnotations_man = d3.annotation()
    .editMode(false)
    .type(d3.annotationCallout)   //This needs to be set to the correct type (see http://d3-annotation.susielu.com/#types)
    .annotations(circleAnnotations_man)
  svg.append("g")
      .attr("id", "man_anno")
      .attr("class", "annotation-group")
      .call(makeCircleAnnotations_man)      //This needs to call the object made above






















  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0, -50)")
      .call(d3.axisTop(x));

  svg.selectAll(".genDot")
      .data(data)
    .enter().append("circle")
      .attr("class", "genDot")
      .attr("r", 10)
      // .attr("r", function(d){return Math.abs(d.perdiffMF)/4})
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); })
      .style("opacity", 1)
      // .style("stroke", 'white')
      // .style("stroke-width", 0.5)
      .style("stroke", function(d){
        if (d.gen_name == "lord"){return "rgb(105,174,68)"}
          else {return "white"}
        })
      .style("stroke-width", function(d){
        if (d.gen_name == "lord") {return 2}
          else {return 0.5}
        })
      .style("fill", function(d){
        if (d.gen_name == "lord" ) {return "white"}
          else if (d.gender == 1) {return "rgb(39,123,191)"}
          else {return "rgb(243,185,47)"}
      })
      .on('mouseover', function (d) {
          var section = d3.select(this);
              section.style("opacity", 0.6)
          d3.select('#tooltip')
          .style("left", (d3.event.pageX + 5) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .select('#value')
          .text( Math.round(d.gen_per).toFixed(2) + "%" );
           d3.select('#tooltip').classed('hidden', false);
          })
      .on("click",  function(d){
          $(".genNames").html(d.char_list);
          $("#genTitle").html(d.gen_name);
          d3.selectAll(".genDot").style("fill", function(d){
              if (d.gender == 1) {return "rgb(39,123,191)"}
              else {return "rgb(243,185,47)"}
          }).style("stroke", 'white').style("stroke-width", 0.5)
          d3.select(this).style("fill", 'white').style("stroke", "rgb(105,174,68)").style("stroke-width", 2);
          }) 
      .on('mouseout', function () {
          var section = d3.select(this);
              section.style("opacity", '1')
          d3.select('#tooltip').classed('hidden', true);
        });


  svg.selectAll(".dodo")
  .data(data)
 .enter().append("text")
  .attr("class", "dodo")
  .attr("font-size", 12)
  .attr("x", function(d) {
    if (d.gen_per <=0){return x(d.gen_per)-15}
      else {return x(d.gen_per)+15}
       })
  .attr("y", function(d) {
    if (d.gen_per <=0){return y(d.gen_cat)+4}
      else {return y(d.gen_cat)+4}
       })
  .attr('text-anchor', function(d) {
    if (d.gen_per <= 0) {return 'end'}
      else {return 'start'}
    })
  .text(function(d) { return d.gen_name;});


svg.append("text")
  .attr("class", "small")
  .attr("x", 70)
  .attr("y", -30)
  .attr("class", "label")
  .text("<--- Female percents");

svg.append("text")
  .attr("class", "small")
  .attr("x", width-200)
  .attr("y", -30)
  .attr("class", "label")
  .text("Male percents --->");


var lineEnd = 0;

svg.append("line")
.attr("x1", function(){return x(lineEnd)})
.attr("y1", -40)
.attr("x2", function(){return x(lineEnd)})
.attr("y2", height+50)
.style("stroke-width", 0.3)
.style("stroke", "black")
.style("fill", "none");


      // Make the dotted lines between the dots

      var linesBetween = svg.selectAll("lines.between")
        .data(data)
        .enter()
        .append("line");

      linesBetween.attr("class", "between")
        .style("stroke-width", 0.5)
        .style("stroke", "black")
        .style("fill", "none")
        .attr("x1", function(d){return x(d.gen_per)})
        .attr("y1", function(d){return y(d.gen_cat)})
        .attr("x2", function(d){return x(d.per_fake)})
        .attr("y2", function(d){return y(d.gen_cat)})


});





function maleOrder(){

d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });


function descendingMaleNames(data) {data.sort(function(x, y){
  if(x.gender==1 && y.gender==1) return d3.descending(x.gen_per,y.gen_per)
  else return 1
});}

descendingMaleNames(data);

  x.domain([30,-30]);
  y.domain(data.map(function(d) { return d.gen_cat; }));

 d3.selectAll('.genDot') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); });

 d3.selectAll('.dodo')
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("x", function(d) {
    if (d.gen_per <=0){return x(d.gen_per)-15}
      else {return x(d.gen_per)+15}
       })
  .attr("y", function(d) {
    if (d.gen_per <=0){return y(d.gen_cat)+4}
      else {return y(d.gen_cat)+4}
       })
  .attr('text-anchor', function(d) {
    if (d.gen_per <= 0) {return 'end'}
      else {return 'start'}
    })
  .text(function(d) { return d.gen_name;});


d3.selectAll(".between")
  .data(data)
  .transition().duration(500)
  .delay(function (d,i) { return i*10})
  .attr("x1", function(d){return x(d.gen_per)})
  .attr("y1", function(d){return y(d.gen_cat)})
  .attr("x2", function(d){return x(d.per_fake)})
  .attr("y2", function(d){return y(d.gen_cat)})

});


}; //end maleOrder();




function femaleOrder(){

d3.csv("gender_dumbbell_shortened.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.gen_per = +d.gen_per;
    d.count = +d.count;
    d.per_fake = +d.per_fake;
  });


function ascendingFemaleNames(data) {data.sort(function(x, y){
  if(x.gender==2 && y.gender==2) return d3.ascending(x.gen_per,y.gen_per)
  else return -1
});}

ascendingFemaleNames(data);

  x.domain([30,-30]);
  y.domain(data.map(function(d) { return d.gen_cat; }));

 d3.selectAll('.genDot') // move the circles
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("cx", function(d) { return x(d.gen_per); })
      .attr("cy", function(d) { return y(d.gen_cat); });

 d3.selectAll('.dodo')
      .transition().duration(500)
      .delay(function (d,i) { return i*10})
      .attr("x", function(d) {
    if (d.gen_per <=0){return x(d.gen_per)-15}
      else {return x(d.gen_per)+15}
       })
  .attr("y", function(d) {
    if (d.gen_per <=0){return y(d.gen_cat)+4}
      else {return y(d.gen_cat)+4}
       })
  .attr('text-anchor', function(d) {
    if (d.gen_per <= 0) {return 'end'}
      else {return 'start'}
    })
  .text(function(d) { return d.gen_name;});


d3.selectAll(".between")
  .data(data)
  .transition().duration(500)
  .delay(function (d,i) { return i*10})
  .attr("x1", function(d){return x(d.gen_per)})
  .attr("y1", function(d){return y(d.gen_cat)})
  .attr("x2", function(d){return x(d.per_fake)})
  .attr("y2", function(d){return y(d.gen_cat)})

});


}; //end femaleOrder();


$( "#descendingFemale" ).click(function() {
 femaleOrder();
 $("#man_anno").delay(500).show(500);
 $("#girl_anno").delay(500).show(500);
});

$( "#descendingMale" ).click(function() {
 maleOrder();
 $("#man_anno").delay(500).hide(500);
 $("#girl_anno").delay(500).hide(500);
});



// init()
})()
